const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid } = require("../utils/validation-utils");
const mysql = require("mysql");

app.get(`/api/reports/ages`, (req, res) => {
  const validationErrors = checkValid(req.query);

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const sql = mysql.format(
    `
      SELECT COUNT(*) total, CASE
        WHEN age between 0 and 17 then '0-17'
        WHEN age between 18 and 24 then '18-24'
        WHEN age between 25 and 34 then '25-34'
        WHEN age between 35 and 44 then '35-44'
        WHEN age between 45 and 54 then '45-54'
        WHEN age between 55 and 64 then '55-64'
        ELSE '65+'
        END AS ageRange
      FROM (
        SELECT TIMESTAMPDIFF(YEAR, birthday, CURDATE()) AS age
        FROM clients
        WHERE clients.isDeleted = false
      ) ages
      GROUP BY ageRange
      ORDER BY ageRange ASC
      ;
    `,
    []
  );

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    res.send({
      ages: result.reduce((acc, row) => {
        acc[row.ageRange] = row.total;
        return acc;
      }, {}),
      reportParameters: {}
    });
  });
});
