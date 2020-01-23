const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid } = require("../utils/validation-utils");
const mysql = require("mysql");

app.get(`/api/reports/genders`, (req, res) => {
  const validationErrors = checkValid(req.query);

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const sql = mysql.format(
    `
      SELECT COUNT(*) count, gender
      FROM clients
      WHERE isDeleted = false
      GROUP BY gender
      ;

      SELECT COUNT(*) count, gender
      FROM leads
      WHERE isDeleted = false
      GROUP BY gender
      ;
    `,
    []
  );

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [clientRows, leadRows] = result;

    res.send({
      clients: clientRows.reduce((acc, row) => {
        acc[row.gender] = row.count;
        return acc;
      }, {}),
      leads: leadRows.reduce((acc, row) => {
        acc[row.gender] = row.count;
        return acc;
      }, {}),
      reportParameters: {}
    });
  });
});
