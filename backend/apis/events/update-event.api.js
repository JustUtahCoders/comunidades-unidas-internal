const {
  app,
  databaseError,
  invalidRequest,
  pool,
  notFound,
} = require("../../server");
const {
  checkValid,
  validId,
  nullableNonEmptyString,
  nullableValidDate,
  nullableValidInteger,
} = require("../utils/validation-utils");
const {
  responseFullName,
  responseBoolean,
  responseDateWithoutTime,
} = require("../utils/transform-utils");
const { getEventById } = require("./get-event.api");
const mysql = require("mysql");

app.patch("/api/events/:eventId", (req, res) => {
  const validationErrors = [
    ...checkValid(
      req.body,
      nullableNonEmptyString("eventName"),
      nullableNonEmptyString("eventLocation"),
      nullableValidDate("eventDate"),
      nullableValidInteger("totalAttendance")
    ),
    ...checkValid(req.params, validId("eventId")),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const { eventId } = req.params;

  getEventById(eventId, (err, event) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const updatedEvent = Object.assign({}, event, req.body);

    const updateSql = mysql.format(
      `
      UPDATE events
      SET eventName = ?, eventDate = ?, eventLocation = ?, totalAttendance = ?
      WHERE id = ?;
    `,
      [
        updatedEvent.eventName,
        updatedEvent.eventDate,
        updatedEvent.eventLocation,
        updatedEvent.totalAttendance,
        eventId,
      ]
    );

    pool.query(updateSql, (err, data) => {
      if (err) {
        return databaseError(err);
      }

      res.send(updatedEvent);
    });
  });
});
