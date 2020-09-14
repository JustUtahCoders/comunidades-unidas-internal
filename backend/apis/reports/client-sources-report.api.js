const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid, nullableValidDate } = require("../utils/validation-utils");
const mysql = require("mysql");

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

  const sql = mysql.format(
    `
      SELECT COUNT(*) total, intakeData.clientSource
      FROM
        (
          SELECT MAX(dateAdded) latestDateAdded, dateOfIntake, clientId FROM intakeData GROUP BY clientId
        ) latestIntakeData
        JOIN intakeData ON latestIntakeData.latestDateAdded = intakeData.dateAdded
        JOIN clients ON clients.id = intakeData.clientId
      WHERE
        clients.isDeleted = false
        AND (latestIntakeData.dateOfIntake BETWEEN ? AND ?)
      GROUP BY intakeData.clientSource
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
