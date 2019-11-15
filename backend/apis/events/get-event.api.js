const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound
} = require("../../server");
const mysql = require("mysql");
const { checkValid, validId } = require("../utils/validation-utils");
const {
  responseFullName,
  responseBoolean,
  responseDateWithoutTime
} = require("../utils/transform-utils");

app.get("/api/events/:id", (req, res, next) => {
  const validationErrors = checkValid(req.params, validId("id"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  getEventById(req.params.id, (err, event) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (event) {
      res.send(event);
    } else {
      notFound(res, `Could not find event with id ${req.params.id}`);
    }
  });
});

exports.getEventById = getEventById;

function getEventById(eventId, cbk, connection) {
  eventId = Number(eventId);

  const getEvent = mysql.format(
    `
      SELECT
        events.id AS eventId,
        events.eventName,
        events.eventDate,
        events.eventLocation,
        events.totalAttendance,
        events.isDeleted,
        events.dateAdded,
        events.dateModified,
        events.addedBy AS createdByUserId,
        events.modifiedBy AS modifiedByUserId,
        created.firstName AS createdByFirstName,
        created.lastName AS createdByLastName,
        modified.firstName AS modifiedByFirstName,
        modified.lastName AS modifiedByLastName
      FROM events
      INNER JOIN users created ON created.id = events.addedBy
      INNER JOIN users modified ON modified.id = events.modifiedBy
      WHERE events.id = ? AND isDeleted = false;
    `,
    [eventId]
  );

  (connection || pool).query(getEvent, (err, data, fields) => {
    if (err) {
      return cbk(err, data, fields);
    }

    if (data.length === 0) {
      return cbk(err, null);
    }

    const bigEventObj = data[0];

    const e = bigEventObj;

    const event = {
      id: e.eventId,
      eventName: e.eventName,
      eventDate: responseDateWithoutTime(e.eventDate),
      eventLocation: e.eventLocation,
      totalAttendance: e.totalAttendance,
      isDeleted: responseBoolean(e.isDeleted),
      createdBy: {
        userId: e.createdByUserId,
        firstName: e.createdByFirstName,
        lastName: e.createdByLastName,
        fullName: responseFullName(e.createdByFirstName, e.createdByLastName),
        timestamp: e.dateAdded
      },
      lastUpdatedBy: {
        userId: e.modifiedByUserId,
        firstName: e.modifiedByFirstName,
        lastName: e.modifiedByLastName,
        fullName: responseFullName(e.modifiedByFirstName, e.modifiedByLastName),
        timestamp: e.dateModified
      }
    };

    cbk(err, event);
  });
}
