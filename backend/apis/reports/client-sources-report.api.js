const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid } = require("../utils/validation-utils");
const mysql = require("mysql");

app.get(`/api/reports/client-sources`, (req, res) => {
  const validationErrors = checkValid(req.query);

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const sql = mysql.format(
    `
      SELECT COUNT(*) total, intakeData.clientSource
      FROM
        (
          SELECT MAX(dateAdded) latestDateAdded, clientId FROM intakeData GROUP BY clientId
        ) latestIntakeData
        JOIN intakeData ON latestIntakeData.latestDateAdded = intakeData.dateAdded
        JOIN clients ON clients.id = intakeData.clientId
      WHERE
        clients.isDeleted = false
      GROUP BY intakeData.clientSource
      ORDER BY total DESC
      ;
    `,
    []
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
      reportParameters: {}
    });
  });
});
