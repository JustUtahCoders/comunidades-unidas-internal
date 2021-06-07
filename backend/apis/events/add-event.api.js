const mysql = require("mysql");
const { app, databaseError, pool, invalidRequest } = require("../../server");
const {
  checkValid,
  nonEmptyString,
  validDate,
  validInteger,
  nullableValidArray,
  validId,
} = require("../utils/validation-utils");
const { getEventById } = require("./get-event.api");

app.post("/api/events", (req, res) => {
  const validityErrors = checkValid(
    req.body,
    nonEmptyString("eventName"),
    nonEmptyString("eventLocation"),
    validDate("eventDate"),
    validInteger("attendanceMale"),
    validInteger("attendanceFemale"),
    validInteger("attendanceOther"),
    validInteger("attendanceUnknown"),
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
  );

  if (validityErrors.length > 0) {
    return invalidRequest(res, validityErrors);
  }

  const user = req.session.passport.user;

  let newEvent = mysql.format(
    `
      INSERT INTO events (
        eventName,
        eventLocation,
        eventDate,
        attendanceMale,
        attendanceFemale,
        attendanceOther,
        attendanceUnknown,
        addedBy,
        modifiedBy
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

      SET @idOfEvent := LAST_INSERT_ID();
    `,
    [
      req.body.eventName,
      req.body.eventLocation,
      req.body.eventDate,
      req.body.attendanceMale,
      req.body.attendanceFemale,
      req.body.attendanceOther,
      req.body.attendanceUnknown,
      user.id,
      user.id,
    ]
  );

  const materialsDistributed = req.body.materialsDistributed || [];

  materialsDistributed.forEach((r) => {
    newEvent += mysql.format(
      `
      INSERT INTO eventMaterials (eventId, materialId, quantityDistributed)
      VALUES (@idOfEvent, ?, ?);
    `,
      [r.materialId, r.quantityDistributed]
    );
  });

  pool.query(newEvent, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const insertResult = result[0];

    getEventById(insertResult.insertId, (err, event) => {
      if (err) {
        return databaseError(req, res, err);
      }
      res.send(event);
    });
  });
});
