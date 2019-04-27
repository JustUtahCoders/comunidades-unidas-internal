const { app, databaseError, pool } = require("../server");
const mysql = require("mysql");

app.post("/api/people-duplicates", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err);
    }
    const birthDate = new Date(req.body.birthday);
    const year = birthDate.getUTCFullYear();
    const month = birthDate.getUTCMonth() + 1;
    const day = birthDate.getUTCDate();
    const query = mysql.format(
      `
      SELECT personid, firstName, lastName, date_format(dob,'%m/%d/%Y') as birthDate ,gender
      FROM person
      WHERE 
      firstName = ? AND lastName = ? AND YEAR(dob) = ? AND MONTH(dob) = ? AND day(dob) = ?
    `,
      [req.body.firstName, req.body.lastName, year, month, day]
    );
    console.log(query);
    connection.query(query, function(err, rows, fields) {
      if (err) {
        return databaseError(req, res, err);
      }
      res.send({
        rows
      });
    });
  });
});
