const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");
const {
  checkValid,
  nullableValidBoolean,
} = require("../utils/validation-utils");

app.get("/api/services", (req, res, next) => {
  const validationErrors = checkValid(
    req.query,
    nullableValidBoolean("includeInactive")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const includeInactive = req.query.includeInactive === "true";

  const getServices = mysql.format(`
    SELECT *, services.id AS serviceId, programs.id AS programId
    FROM services JOIN programs WHERE services.programId = programs.id;

    SELECT * FROM programs;

    SELECT * FROM customServiceQuestions;

    select name, value from customServiceQuestionOptions;
  `);

  pool.query(getServices, (err, results) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [services, programs] = results;
    // console.log("*********SERVICES", services)
    // console.log("*********PROGRAMS", programs)
    console.log("*********PROGRAMS", results);

    const programMap = programs.reduce((acc, program) => {
      acc[program.id] = program;
      return acc;
    }, {});

    res.send({
      services: services
        .filter((s) => (includeInactive ? true : s.isActive))
        .map((s) => ({
          id: s.serviceId,
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

// function getServiceQuestion({ id, isDeleted = false }, errBack) {
//   const query = mysql.format(getSql, [id, isDeleted, id]);
//   pool.query(query, (err, result) => {
//     const questionResult = result[0];
//     const optionResult = result[1];

//     if (err) {
//       return errBack(err, null);
//     } else if (questionResult.length === 0) {
//       errBack(null, 404);
//     } else {
//       const serviceQuestion = questionResult[0];
//       const finalQuestion = {
//         id: serviceQuestion.id,
//         label: serviceQuestion.label,
//         type: serviceQuestion.type,
//         serviceId: serviceQuestion.serviceId,
//         options: optionResult.map((option) => {
//           return {
//             id: option.id,
//             name: option.name,
//             value: option.value,
//           };
//         }),
//       };
//       if (finalQuestion.type !== "select") {
//         delete finalQuestion.options;
//       }
//       errBack(null, finalQuestion);
//     }
//   });
// }
