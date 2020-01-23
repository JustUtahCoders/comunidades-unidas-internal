const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid } = require("../utils/validation-utils");
const mysql = require("mysql");

app.get(`/api/reports/english-levels`, (req, res) => {
  const validationErrors = checkValid(req.query);

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const sql = mysql.format(
    `
      SELECT COUNT(*) total, demographics.englishProficiency
      FROM
        (
          SELECT MAX(dateAdded) latestDateAdded, clientId FROM demographics GROUP BY clientId
        ) latestDems
        JOIN demographics ON latestDems.latestDateAdded = demographics.dateAdded
        JOIN clients ON clients.id = demographics.clientId
      WHERE
        clients.isDeleted = false
      GROUP BY demographics.englishProficiency
      ;
    `,
    []
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
      reportParameters: {}
    });
  });
});
