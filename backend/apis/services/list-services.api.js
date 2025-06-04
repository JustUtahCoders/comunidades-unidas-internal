const { app, databaseError, pool, invalidRequest } = require("../../server");
const mariadb = require("mariadb");
const {
  checkValid,
  nullableValidBoolean,
} = require("../utils/validation-utils");
const _ = require("lodash");

app.get("/api/services", (req, res, next) => {
  const validationErrors = checkValid(
    req.query,
    nullableValidBoolean("includeInactive")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const includeInactive = req.query.includeInactive === "true";

  const getServices = mariadb.format(`
    SELECT * FROM services;

    SELECT * FROM customServiceQuestions where isDeleted = false;

    SELECT * FROM customServiceQuestionOptions;

    SELECT * FROM programs;
  `);

  pool.query(getServices, (err, results) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [
      services,
      customServiceQuestions,
      customServiceQuestionOptions,
      programs,
    ] = results;

    const programMap = programs.reduce((acc, program) => {
      acc[program.id] = program;
      return acc;
    }, {});

    const groupedCustomQuestions = _.groupBy(
      customServiceQuestions,
      "serviceId"
    );
    const groupedCustomQuestionOptions = _.groupBy(
      customServiceQuestionOptions,
      "questionId"
    );

    customServiceQuestions.forEach((q) => {
      q.options = groupedCustomQuestionOptions[q.id];
    });

    res.send({
      services: services
        .filter((s) => (includeInactive ? true : s.isActive))
        .map((s) => ({
          id: s.id,
          serviceName: s.serviceName,
          serviceDescription: s.serviceDesc,
          programId: s.programId,
          programName: programMap[s.programId].programName,
          defaultLineItemName: s.defaultLineItemName,
          defaultLineItemDescription: s.defaultLineItemDescription,
          defaultLineItemRate: s.defaultLineItemRate,
          defaultInteractionType: s.defaultInteractionType,
          defaultInteractionLocation: s.defaultInteractionLocation,
          defaultInteractionDuration: s.defaultInteractionDuration,
          isActive: Boolean(s.isActive),
          questions: (groupedCustomQuestions[s.id] || []).map((q) => ({
            id: q.id,
            label: q.label,
            serviceId: q.serviceId,
            type: q.type,
            options: q.options,
          })),
        })),
      programs: programs.map((p) => ({
        id: p.id,
        programName: p.programName,
        programDescription: p.programDescription,
        isActive: services.some((s) => s.programId === p.id && s.isActive),
      })),
    });
  });
});
