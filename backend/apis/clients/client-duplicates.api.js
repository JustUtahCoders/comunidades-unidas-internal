const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");
const {
  checkValid,
  nonEmptyString,
  validDate
} = require("../utils/validation-utils");

app.get("/api/client-duplicates", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err, connection);
    }

    const validationErrors = checkValid(
      req.query,
      nonEmptyString("firstName"),
      nonEmptyString("lastName"),
      validDate("birthday"),
      nonEmptyString("gender")
    );

    if (validationErrors.length > 0) {
      return invalidRequest(res, validationErrors);
    }

    const birthDate = new Date(req.query.birthday);
    const year = birthDate.getUTCFullYear();
    const month = birthDate.getUTCMonth() + 1;
    const query = mysql.format(
      `
      SELECT id, firstName, lastName, date_format(birthday,'%Y/%m/%d') as birthday, gender
      FROM clients
      WHERE 
      (firstName LIKE ? OR lastName LIKE ?)
      AND
      (YEAR(birthday) >= ? AND YEAR(birthday) <= ? AND MONTH(birthday) >= ? AND MONTH(birthday) <= ?)
    `,
      [
        req.query.firstName,
        req.query.lastName,
        year - 3,
        year + 3,
        Math.max(1, month - 3),
        Math.min(12, month + 3)
      ]
    );

    connection.query(query, function(err, rows, fields) {
      if (err) {
        return databaseError(req, res, err, connection);
      }
      connection.release();
      res.send({
        numDuplicates: rows.length,
        clientDuplicates: rows.map(row => ({
          id: row.id,
          firstName: row.firstName,
          lastName: row.lastName,
          birthday: row.birthday,
          gender: row.gender
        }))
      });
    });
  });
});
