const mysql = require("mysql");
const { app, databaseError, pool, invalidRequest } = require("../../server");
const {
  checkValid,
  nonEmptyString,
  validDate,
  validInteger
} = require("../utils/validation-utils");
const { getEventById } = require("./get-event.api");

app.post("/api/events", (req, res) => {
  const validityErrors = checkValid(
    req.body,
    nonEmptyString("eventName"),
    nonEmptyString("eventLocation"),
    validDate("eventDate"),
    validInteger("totalAttendance")
  );

  if (validityErrors.length > 0) {
    return invalidRequest(res, validityErrors);
  }

  const user = req.session.passport.user;

  const newEvent = mysql.format(
    `
      INSERT INTO events (
        eventName,
        eventLocation,
        eventDate,
        totalAttendance,
        addedBy,
        modifiedBy
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      req.body.eventName,
      req.body.eventLocation,
      req.body.eventDate,
      req.body.totalAttendance,
      user.id,
      user.id
    ]
  );

  pool.query(newEvent, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    getEventById(result.insertId, (err, event) => {
      if (err) {
        return databaseError(req, res);
      }
      res.send(event);
    });
  });
});
