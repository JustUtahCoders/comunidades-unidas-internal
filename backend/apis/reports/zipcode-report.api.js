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
      SELECT zip, COUNT(*) as clientCount
      FROM clients
        INNER JOIN (
          SELECT * FROM contactInformation innerContactInformation
          JOIN (
            SELECT clientId latestClientId,
              MAX(dateAdded) latestDateAdded
              FROM contactInformation
            GROUP BY clientId
            ) latestContactInformation ON latestContactInformation.latestDateAdded = innerContactInformation.dateAdded
            ) contactInfo ON contactInfo.clientId = clients.id
            GROUP BY zip ORDER BY clientCount DESC;
        `,

    [startDate, endDate, startDate, endDate]
  );

  pool.query(sql, (err, results) => {
    if (err) {
      return databaseError(req, res, err);
    }

    res.send({
      results,
      reportParameters: {
        start: req.query.start || null,
        end: req.query.end || null,
      },
    });
  });
});
