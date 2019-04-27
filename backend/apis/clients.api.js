const { app, databaseError, pool } = require("../server");
const mysql = require("mysql");

app.post("/api/clients/", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err);
    }
    var queryString =
      "SELECT firstName,Lastname,dob,zip,primaryPhone FROM personlistview WHERE (firstName LIKE ? AND lastName LIKE ?) OR zip = ? ORDER BY firstName DESC LIMIT 100";
    if (req.query.page) {
      var offset = parseInt(req.query.page) * 100;
      queryString += "," + offset;
    }
    const query = mysql.format(queryString, [
      req.query.firstName + "%",
      req.query.lastName + "%",
      req.query.zip
    ]);
    connection.query(query, function(err, rows, fields) {
      if (err) {
        return databaseError(req, res, err);
      }
      res.send({ rows });
    });
  });
});
