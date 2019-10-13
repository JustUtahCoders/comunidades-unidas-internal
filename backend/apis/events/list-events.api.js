const { app, databaseError, pool } = require("../../server");
const mysql = require("mysql");

app.get("/api/events", (req, res, next) => {
  const getEvents = mysql.format(`SELECT * FROM events;`);

  pool.query(getEvents, (err, results) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [events] = results;

    res.send(results);
  });
});
