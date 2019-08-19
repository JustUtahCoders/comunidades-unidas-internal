const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound
} = require("../../../server");
const mysql = require("mysql");
const {
  checkValid,
  validId,
  validEnum,
  nonEmptyString,
  validDate,
  validTime,
  validInteger
} = require("../../utils/validation-utils");
const {
  createResponseInteractionObject
} = require("./client-interaction.utils");
const {
  createResponseLogObject
} = require("../client-logs/activity-log.utils");

app.post("/api/clients/:clientId/interactions", (req, res) => {
  const validationErrors = [
    ...checkValid(req.params, validId("clientId")),
    ...checkValid(
      req.body,
      validInteger("serviceId"),
      validEnum("title"),
      validEnum("interactionType"),
      nonEmptyString("description"),
      validDate("dateOfInteraction"),
      validTime("duration"),
      validEnum("location")
    )
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const user = req.session.passport.user;

  const sql = mysql.format(
    `
      INSERT INTO clientInteractions
      (clientId, serviceId, interactionType, dateOfInteraction, duration, location, createdBy)
      VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?);
      INSERT INTO clientLogs
      (clientId, title, description, logType, addedBy, detailId)
      VALUES (?, ?, ?, ?, ?, LAST_INSERT_ID());
    `,
    [
      req.params.clientId,
      req.body.serviceId,
      req.body.interactionType,
      req.body.dateOfInteraction,
      req.body.duration,
      req.body.location,
      req.body.createdBy,
      req.body.title,
      req.body.description,
      req.body.logType,
      req.body.addedBy,
      req.body.detailId,
      user.id
    ]
  );

  pool.query(sql, (err, result) => {
    if (err) {
      console.log("testing 2");
      console.log(req.body);
      return databaseError(req, res, err);
    }

    res.send(
      createResponseInteractionObject({
        id: result.id,
        serviceId: req.body.serviceId,
        interactionType: req.body.interactionType,
        dateOfInteraction: req.body.dateOfInteraction,
        duration: req.body.duration,
        location: req.body.location,
        isDeleted: false,
        createdById: user.id,
        createdByFirstName: user.firstName,
        createdByLastName: user.lastName,
        dateAdded: new Date()
      })
    );
  });
});
