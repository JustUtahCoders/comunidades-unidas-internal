const { app, databaseError, pool } = require("../../server");
const mysql = require("mysql");

app.get("/api/services", (req, res, next) => {
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
      services: services.map(s => ({
        id: s.id,
        serviceName: s.serviceName,
        serviceDescription: s.serviceDesc,
        programId: s.programId,
        programName: programMap[s.programId].programName
      })),
      programs: programs.map(p => ({
        id: p.id,
        programName: p.programName,
        programDescription: p.programDescription
      }))
    });
  });
});
