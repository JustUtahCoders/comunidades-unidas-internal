const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");

app.get("/api/services", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err, connection);
    }

    const getServices = mysql.format(`SELECT * FROM services`);

    connection.query(getServices, (err, data) => {
      if (err) {
        return databaseError(req, res, err, connection);
      }

      connection.release();

      res.send({
        services: data.map(s => ({
          id: s.id,
          serviceName: s.serviceName,
          serviceDescription: s.serviceDesc
        }))
      });
    });
  });
});
