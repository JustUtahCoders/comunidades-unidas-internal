const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid, nullableValidDate } = require("../utils/validation-utils");
const mariadb = require("mariadb/callback.js");

app.get(`/api/reports/client-sources`, (req, res) => {
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

  const sql = mariadb.format(
    `
      SELECT COUNT(*) total, latestIntakeData.clientSource
      FROM
        latestIntakeData
        JOIN clients ON clients.id = latestIntakeData.clientId
      WHERE
        clients.isDeleted = false
        AND (latestIntakeData.dateOfIntake BETWEEN ? AND ?)
      GROUP BY latestIntakeData.clientSource
      ORDER BY total DESC
      ;
    `,
    [startDate, endDate]
  );

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const clientSources = result;

    res.send({
      clientSources: clientSources.reduce((acc, row) => {
        acc[row.clientSource] = row.total;
        return acc;
      }, {}),
      reportParameters: {
        start: req.query.start || null,
        end: req.query.end || null,
      },
    });
  });
});
