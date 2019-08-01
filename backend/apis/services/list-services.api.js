const { app, databaseError, pool } = require("../../server");
const mysql = require("mysql");

app.get("/api/services", (req, res, next) => {
  const getServices = mysql.format(`SELECT * FROM services`);

  pool.query(getServices, (err, data) => {
    if (err) {
      return databaseError(req, res, err);
    }

    res.send({
      services: data.map(s => ({
        id: s.id,
        serviceName: s.serviceName,
        serviceDescription: s.serviceDesc
      }))
    });
  });
});
