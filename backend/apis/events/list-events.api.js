const { app, databaseError, pool } = require("../../server");
const mysql = require("mysql");
const {
  responseFullName,
  responseBoolean,
  responseDateWithoutTime
} = require("../utils/transform-utils");

app.get("/api/events", (req, res, next) => {
  const getEvents = mysql.format(`
    SELECT
      events.id AS eventId,
      events.eventName,
      events.eventDate,
      events.eventLocation,
      events.totalAttendence,
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
    WHERE events.isDeleted = false;
  `);

  pool.query(getEvents, (err, results) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const mapEventsData = results.map(result => {
      return {
        id: result.eventId,
        eventName: result.eventName,
        eventDate: responseDateWithoutTime(result.eventDate),
        eventLocation: result.eventLocation,
        totalAttendence: result.totalAttendence,
        isDeleted: responseBoolean(result.isDeleted),
        createdBy: {
          userId: result.createdByUserId,
          firstName: result.createdByFirstName,
          lastName: result.createdByLastName,
          fullName: responseFullName(
            result.createdByFirstName,
            result.createdByLastName
          ),
          timestamp: result.dateAdded
        },
        lastUpdatedBy: {
          userId: result.modifiedByUserId,
          firstName: result.modifiedByFirstName,
          lastName: result.modifiedByLastName,
          fullName: responseFullName(
            result.modifiedByFirstName,
            result.modifiedByLastName
          ),
          timestamp: result.dateModified
        }
      };
    });

    res.send({
      events: mapEventsData
    });
  });
});
