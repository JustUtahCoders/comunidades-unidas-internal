const { app, databaseError, pool } = require("../server");
const mysql = require("mysql");

app.get("/api/client-list", (req, res, next) => {
  poool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err);
    }
    const query = mysql.format("foo ?", [bar]);

    connection.query(query, function(err, rows) {
      if (err) {
        return databaseError(req, res, err);
      }
      res.send({
        clientList: rows
      });
    });
  });
});
