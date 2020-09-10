const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid, nullableValidDate } = require("../utils/validation-utils");
const mysql = require("mysql");

app.get(`/api/reports/countries-of-origin`, (req, res) => {
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
      SELECT COUNT(*) total, demographics.countryOfOrigin
      FROM
        (
          SELECT MAX(dateAdded) latestDateAdded, id FROM demographics GROUP BY clientId
        ) latestDems
        JOIN demographics ON latestDems.id = demographics.id
        JOIN clients ON clients.id = demographics.clientId
        JOIN
        (
          SELECT MAX(dateAdded) latestDateAdded, dateOfIntake, clientId FROM intakeData GROUP BY clientId
        ) latestIntake ON latestIntake.clientId = clients.id
      WHERE
        clients.isDeleted = false
        AND (dateOfIntake BETWEEN ? AND ?)
      GROUP BY demographics.countryOfOrigin
      ORDER BY total DESC
      ;
    `,
    [startDate, endDate]
  );

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const countriesOfOrigin = result;

    res.send({
      countriesOfOrigin: countriesOfOrigin.reduce((acc, row) => {
        const countryName = row.countryOfOrigin || "Unknown";
        acc[countryName] = row.total;
        return acc;
      }, {}),
      reportParameters: {
        start: req.query.start || null,
        end: req.query.end || null,
      },
    });
  });
});
