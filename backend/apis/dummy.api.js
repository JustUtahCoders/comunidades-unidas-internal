const { app, databaseError, pool } = require("../server");
const mysql = require("mysql");

app.post("/api/users", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err);
    }

    connection.query(
      mysql.format(`SELECT * FROM Dummy WHERE name=?`, [req.body.name]),
      function(err, rows, fields) {
        connection.release();

        if (err) {
          return databaseError(req, res, err);
        }

        res.send(rows[0]);
      }
    );
  });
});
