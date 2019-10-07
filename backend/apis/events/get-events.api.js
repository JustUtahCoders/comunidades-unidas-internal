const mysql = require(mysql);
const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound
} = require("../../server");
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
      res.send({
        event
      });
    } else {
      notFound(res, `Could not find event with id ${req.params.id}`);
    }
  });
});

exports.getEventById = this.getEventById;

function getEventById(eventId, cbk, connection) {
  eventId = Number(eventId);

  const getEvent = mysql.format(
    `
			SELECT
				events.id as eventId,
				events.eventName,
				events.eventDate,
				events.eventLocation,
				events.totalAttendence,
				events.isDeleted,
				events.dateAdded,
				events.dateModified,
				events.addedBy AS createdByUserId,
				events.modifiedBy AS modifiedByUserId
				created.firstName AS createdByFirstName,
				created.lastName AS createdByLastName,
				modified.firstName AS modifiedByFirstName,
				modified.lastName AS modifiedByLastName
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

    const bigEventObj = data[0];

    if (bigEventObj.length === 0) {
      return cbk(err, null);
    }

    const c = bigEventObj[0];

    const event = {
      id: event.id,
      eventName: event.eventName,
      eventDate: event.eventDate,
      eventLocation: event.eventLocation,
      totalAttendence: event.totalAttendence,
      isDelete: event.isDeleted,
      createdBy: {
        userId: event.createdByUserId,
        firstName: event.createdByFirstName,
        lastName: event.createdByLastName,
        fullName: responseFullName(
          event.createdByFirstName,
          event.createdByLastName
        ),
        timpstamp: event.dateAdded
      },
      lastUpdatedBy: {
        userId: event.modifiedByUserId,
        firstName: event.modifiedByUserFirstName,
        lastName: event.modifiedByUserLastName,
        fullName: responseFullName(
          event.modifiedByFirstName,
          event.modifiedByLastName
        ),
        timpstamp: event.dateModified
      }
    };

    cbk(err, event);
  });
}
