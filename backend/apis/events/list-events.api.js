const { app, databaseError, pool } = require("../../server");
const mysql = require("mysql");

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
    INNER JOIN users modified ON modified.id = events.modifiedBy;
  `);

  pool.query(getEvents, (err, results) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [events] = results;

    res.send({
      events: events.map(e => ({
        id: e.eventId,
        eventName: e.eventName,
        eventDate: responseDateWithoutTime(e.eventDate),
        eventLocation: e.eventLocation,
        totalAttendence: e.totalAttendence,
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
          fullName: responseFullName(
            e.modifiedByFirstName,
            e.modifiedByLastName
          ),
          timestamp: e.dateModified
        }
      }))
    });
  });
});
