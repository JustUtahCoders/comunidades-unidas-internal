const { app, databaseError, pool } = require("../server");
const mysql = require("mysql");

app.post("/api/list-clientsbyzip/", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err);
    }
    const query = mysql.format(
      "SELECT firstname,lastname,dob,zip,primaryphone,addedby,dateadded FROM personListView WHERE zip = ?",
      [req.body.zip]
    );
    connection.query(query, function(err, rows, fields) {
      if (err) {
        return databaseError(req, res, err);
      }
      res.send({ rows });
    });
  });
});
