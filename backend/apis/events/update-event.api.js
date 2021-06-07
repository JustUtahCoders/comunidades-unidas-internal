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
  nullableValidArray,
  nullableValidInteger,
  validInteger,
} = require("../utils/validation-utils");
const { getEventById } = require("./get-event.api");
const mysql = require("mysql");

app.patch("/api/events/:eventId", (req, res) => {
  const validationErrors = [
    ...checkValid(
      req.body,
      nullableNonEmptyString("eventName"),
      nullableNonEmptyString("eventLocation"),
      nullableValidDate("eventDate"),
      nullableValidInteger("attendanceMale"),
      nullableValidInteger("attendanceFemale"),
      nullableValidInteger("attendanceOther"),
      nullableValidInteger("attendanceUnknown"),
      nullableValidArray("materialsDistributed", (index) => {
        return (materialsDistributed) => {
          const errs = checkValid(
            materialsDistributed[index],
            validId("materialId"),
            validInteger("quantityDistributed")
          );
          return errs.length > 0 ? errs : null;
        };
      })
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

    let updateSql = mysql.format(
      `
      UPDATE events
      SET eventName = ?, eventDate = ?, eventLocation = ?, attendanceMale = ?, attendanceFemale = ?, attendanceOther = ?, attendanceUnknown = ?
      WHERE id = ?;
    `,
      [
        updatedEvent.eventName,
        updatedEvent.eventDate,
        updatedEvent.eventLocation,
        updatedEvent.attendanceMale,
        updatedEvent.attendanceFemale,
        updatedEvent.attendanceOther,
        updatedEvent.attendanceUnknown,
        eventId,
      ]
    );

    if (req.body.materialsDistributed) {
      updateSql += mysql.format(
        `
        DELETE FROM eventMaterials WHERE eventId = ?;
        `,
        [eventId]
      );

      req.body.materialsDistributed.forEach((r) => {
        updateSql += mysql.format(
          `
          INSERT INTO eventMaterials (eventId, materialId, quantityDistributed)
          VALUES (?, ?, ?);
        `,
          [eventId, r.materialId, r.quantityDistributed]
        );
      });
    }

    pool.query(updateSql, (err, data) => {
      if (err) {
        return databaseError(req, res, err);
      }

      getEventById(eventId, (err, event) => {
        if (err) {
          return databaseError(req, res, err);
        }

        if (event === null) {
          return databaseError(
            req,
            res,
            `Could not retrieve event after updating it`
          );
        }

        res.send(event);
      });
    });
  });
});
