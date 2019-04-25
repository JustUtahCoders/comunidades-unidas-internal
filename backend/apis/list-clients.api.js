const { app, databaseError, pool } = require("../server");
const mysql = require("mysql");

app.post("/api/people-list/", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err);
    }
    const query = mysql.format(
      "SELECT firstName,Lastname,dob,zip,primaryPhone FROM personlistview WHERE firstName LIKE ? AND lastName LIKE ?",
      [req.body.firstName + "%", req.body.lastName + "%"]
    );
    connection.query(query, function(err, rows, fields) {
      if (err) {
        return databaseError(req, res, err);
      }
      console.log(query + rows);
      res.send({ rows });
    });
  });
});
