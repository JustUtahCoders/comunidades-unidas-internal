const { app, databaseError, pool, invalidRequiest } = require("../../server");
const mysql = require("mysql");

app.get("/api/clients", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err);
    }
    var queryString = "SELECT ? AS result";

    const query = mysql.format(queryString, [req.query.foo]);

    connection.query(query, function(err, rows, fields) {
      if (err) {
        return databaseError(req, res, err);
      }
      res.send({
        numClients: rows.length,
        clients: rows.map(row => ({
          result: row.result
        }))
      });
    });
  });
});
