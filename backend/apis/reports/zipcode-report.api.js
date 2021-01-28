const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid, nullableValidDate } = require("../utils/validation-utils");
const mysql = require("mysql");

app.get(`/api/reports/client-zipcodes`, (req, res) => {
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
      SELECT zip, COUNT(*) clientCount
      FROM (
        SELECT clientId, MAX(contactInformation.dateAdded) latestDateAdded, zip
        FROM contactInformation
        JOIN clients ON clients.id = contactInformation.clientId
        WHERE clients.isDeleted = false
        GROUP BY clientId
      ) latestZips
      GROUP BY zip
      ;
        `,

    [startDate, endDate, startDate, endDate]
  );

  pool.query(sql, (err, results) => {
    if (err) {
      return databaseError(req, res, err);
    }

    res.send({
      results,
      totalClients: results.reduce((acc, item) => acc + item.clientCount, 0),
      totalZipCodes: results.length,
      reportParameters: {
        start: req.query.start || null,
        end: req.query.end || null,
      },
    });
  });
});
