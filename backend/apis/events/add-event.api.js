const mysql = require("mysql");
const { app, databaseError, pool, invalidRequest } = require("../../server");
const {
  checkValid,
  nonEmptyString,
  validDate,
  validInteger
} = require("../utils/validation-utils");

app.post("/api/events", (req, res, next) => {
  const validityErrors = checkValid(
    req.body,
    nonEmptyString("eventName"),
    nonEmptyString("eventLocation"),
    validDate("eventDate"),
    validInteger("totalAttendence")
  );

  if (validityErrors.length > 0) {
    return invalidRequest(res, validityErrors, connection);
  }

  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err, connection);
    }

    const user = req.session.passport.user;

    const newEvent = mysql.format(
      `
        INSERT INTO events
          eventName,
          eventLocation,
          eventDate,
          totalAttendence,
          addedBy,
          modifiedBy
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        req.body.eventName,
        req.body.eventLocation,
        req.body.eventDate,
        req.body.totalAttendence,
        user.id,
        user.id
      ]
    );

    connection.query(newEvent, (newEventErr, result, fields) => {
      if (err) {
        return databaseError(req, res, err, connection);
      }

      const event = result;

      res.json(event);
    });
  });
});
