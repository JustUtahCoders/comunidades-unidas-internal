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
				events.createdBy,
				events.lastUpdatedBy
		`
  );
}
