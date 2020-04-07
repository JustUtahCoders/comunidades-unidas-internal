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
  `);

  pool.query(getServices, (err, results) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [services, programs] = results;

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
