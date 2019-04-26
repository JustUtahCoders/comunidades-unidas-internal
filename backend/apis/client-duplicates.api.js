const { app, databaseError, pool, invalidRequest } = require("../server");
const mysql = require("mysql");

app.get("/api/client-duplicates", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (!req.query.firstName) {
      return invalidRequest(res, `queryParam 'firstName' is required`);
    }

    if (!req.query.lastName) {
      return invalidRequest(res, `queryParam 'firstName' is required`);
    }

    if (!req.query.dob) {
      return invalidRequest(res, `queryParam 'dob' is required`);
    }

    let birthDate;
    try {
      birthDate = new Date(req.query.dob);
    } catch (err) {
      return invalidRequest(
        res,
        `queryParam 'dob' must be a valid date. Use YYYY-MM-DD format`
      );
    }

    if (isNaN(birthDate)) {
      return invalidRequest(
        res,
        `queryParam 'dob' must be a valid date. Use YYYY-MM-DD format`
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
      SELECT id, firstName, lastName, date_format(dob,'%Y/%m/%d') as birthDate, gender
      FROM clients
      WHERE 
      (firstName LIKE ? OR lastName LIKE ?)
      AND
      (YEAR(dob) >= ? AND YEAR(dob) <= ? AND MONTH(dob) >= ? AND MONTH(dob) <= ?)
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
        return databaseError(req, res, err);
      }
      res.send({
        numDuplicates: rows.length,
        clientDuplicates: rows.map(row => ({
          id: row.id,
          firstName: row.firstName,
          lastName: row.lastName,
          dob: row.birthDate,
          gender: row.gender
        }))
      });
    });
  });
});
