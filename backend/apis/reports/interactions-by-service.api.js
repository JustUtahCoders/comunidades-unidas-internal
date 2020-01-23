const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid, nullableValidDate } = require("../utils/validation-utils");
const { responseFullName } = require("../utils/transform-utils");
const mysql = require("mysql");

const pageSize = 100;
const sixHoursInSeconds = 6 * 60 * 60;

app.get(`/api/reports/interactions-by-service`, (req, res) => {
  const validationErrors = checkValid(
    req.query,
    nullableValidDate("start"),
    nullableValidDate("end")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const startDate = req.query.start || "2000-01-01T0";
  const endDate = req.query.end || "3000-01-01T0";

  const sql = mysql.format(
    `
      SELECT totalInteractions, services.id serviceId, services.serviceName, programs.id programId, programs.programName
      FROM
        services
        LEFT OUTER JOIN
        (
          SELECT COUNT(*) totalInteractions, serviceId
          FROM clientInteractions
          WHERE isDeleted = false AND dateOfInteraction >= ? AND dateOfInteraction <= ?
          GROUP BY serviceId
        ) numInteractions
        ON services.id = numInteractions.serviceId
        JOIN programs ON programs.id = services.programId
      ;
    `,
    [startDate, endDate]
  );

  console.log(sql);

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    res.send({
      services: result.map(service => ({
        serviceName: service.serviceName,
        programName: service.programName,
        numInteractions: service.totalInteractions || 0,
        serviceId: service.serviceId,
        programId: service.programId
      })),
      reportParameters: {
        start: startDate,
        end: endDate
      }
    });
  });
});
