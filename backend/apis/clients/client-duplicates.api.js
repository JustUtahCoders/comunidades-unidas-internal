const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");

app.get("/api/client-duplicates", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err, connection);
    }

    if (!req.query.firstName) {
      return invalidRequest(res, `queryParam 'firstName' is required`);
    }

    if (!req.query.lastName) {
      return invalidRequest(res, `queryParam 'firstName' is required`);
    }

    if (!req.query.birthday) {
      return invalidRequest(res, `queryParam 'birthday' is required`);
    }

    let birthDate;
    try {
      birthDate = new Date(req.query.birthday);
    } catch (err) {
      return invalidRequest(
        res,
        `queryParam 'birthday' must be a valid date. Use YYYY-MM-DD format`
      );
    }

    if (isNaN(birthDate)) {
      return invalidRequest(
        res,
        `queryParam 'birthday' must be a valid date. Use YYYY-MM-DD format`
      );
    }

    if (!req.query.gender) {
      res.status(400).send({ error: `queryParam 'gender' is required` });
      return;
    }

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
