const { app, databaseError, pool } = require("../server");
const mysql = require("mysql");

app.post("/api/duplicate-check/", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err);
    }
    let d = new Date(req.body.birthday);
    let year = d.getUTCFullYear();
    let month = d.getUTCMonth() + 1;
    let day = d.getUTCDate();
    let inserts = [req.body.firstname, req.body.lastname, year, month, day];
    let qryString =
      "SELECT personid,firstname,lastname,date_format(dob,'%m/%d/%Y')as birthDate,gender FROM person WHERE ";
    qryString +=
      "((firstname = ? OR lastname = ?) AND (year(dob) = ? OR month(dob) = ? OR day(dob) = ?))";
    let query = mysql.format(qryString, inserts);
    connection.query(query, function(err, rows, fields) {
      if (err) {
        return databaseError(req, res, err);
      }
      res.send(rows);
    });
  });
});
