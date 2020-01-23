const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid } = require("../utils/validation-utils");
const mysql = require("mysql");

app.get(`/api/reports/countries-of-origin`, (req, res) => {
  const validationErrors = checkValid(req.query);

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const sql = mysql.format(
    `
      SELECT COUNT(*) total, demographics.countryOfOrigin
      FROM
        (
          SELECT MAX(dateAdded) latestDateAdded, clientId FROM demographics GROUP BY clientId
        ) latestDems
        JOIN demographics ON latestDems.latestDateAdded = demographics.dateAdded
        JOIN clients ON clients.id = demographics.clientId
      WHERE
        clients.isDeleted = false
      GROUP BY demographics.countryOfOrigin
      ORDER BY total DESC
      ;
    `,
    []
  );

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const countriesOfOrigin = result;

    res.send({
      countriesOfOrigin: countriesOfOrigin.reduce((acc, row) => {
        acc[row.countryOfOrigin] = row.total;
        return acc;
      }, {}),
      reportParameters: {}
    });
  });
});
