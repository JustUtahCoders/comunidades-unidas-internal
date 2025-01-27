const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid, nullableValidDate } = require("../utils/validation-utils");
const mysql = require("mysql2");

app.get(`/api/reports/english-levels`, (req, res) => {
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
      SELECT COUNT(*) total, latestDemographics.englishProficiency
      FROM
        latestDemographics 
        JOIN clients ON clients.id = latestDemographics.clientId
        JOIN latestIntakeData latestIntake ON latestIntake.clientId = clients.id
      WHERE
        clients.isDeleted = false
        AND (dateOfIntake BETWEEN ? AND ?)
      GROUP BY latestDemographics.englishProficiency
      ;
    `,
    [startDate, endDate]
  );

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const englishLevels = result;

    res.send({
      englishLevels: englishLevels.reduce((acc, level) => {
        acc[level.englishProficiency || "Unknown"] = level.total;
        return acc;
      }, {}),
      reportParameters: {
        start: req.query.start || null,
        end: req.query.end || null,
      },
    });
  });
});
