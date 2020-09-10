const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid, nullableValidDate } = require("../utils/validation-utils");
const mysql = require("mysql");

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
      SELECT COUNT(*) total, demographics.englishProficiency
      FROM
        (
          SELECT MAX(dateAdded) latestDateAdded, clientId FROM demographics GROUP BY clientId
        ) latestDems
        JOIN demographics ON latestDems.latestDateAdded = demographics.dateAdded
        JOIN clients ON clients.id = demographics.clientId
        JOIN
        (
          SELECT MAX(dateAdded) latestDateAdded, dateOfIntake, clientId FROM intakeData GROUP BY clientId
        ) latestIntake ON latestIntake.clientId = clients.id
      WHERE
        clients.isDeleted = false
        AND (dateOfIntake BETWEEN ? AND ?)
      GROUP BY demographics.englishProficiency
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
        acc[level.englishProficiency] = level.total;
        return acc;
      }, {}),
      reportParameters: {
        start: req.query.start || null,
        end: req.query.end || null,
      },
    });
  });
});
