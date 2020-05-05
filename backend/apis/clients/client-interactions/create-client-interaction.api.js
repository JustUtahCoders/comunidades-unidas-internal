const { app, databaseError, pool, invalidRequest } = require("../../../server");
const mysql = require("mysql");
const {
  checkValid,
  validId,
  validEnum,
  nullableNonEmptyString,
  validDate,
  validTime,
  validInteger,
  nullableValidTags,
} = require("../../utils/validation-utils");
const { getInteraction } = require("./client-interaction.utils");
const { insertTagsQuery } = require("../../tags/tag.utils.js");

app.post("/api/clients/:clientId/interactions", (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.params, validId("clientId")),
    ...checkValid(req.query, nullableValidTags("tags", user.permissions)),
    ...checkValid(
      req.body,
      validInteger("serviceId"),
      validEnum(
        "interactionType",
        "inPerson",
        "byPhone",
        "workshopTalk",
        "oneOnOneLightTouch",
        "consultation"
      ),
      nullableNonEmptyString("description"),
      validDate("dateOfInteraction"),
      validTime("duration"),
      validEnum("location", "CUOffice", "consulateOffice", "communityEvent")
    ),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const getServiceSql = mysql.format(
    `SELECT serviceName FROM services WHERE id = ?`,
    [req.body.serviceId]
  );

  pool.query(getServiceSql, (err, getServiceResult) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (getServiceResult.length !== 1) {
      return invalidRequest(
        res,
        `No CU service exists with id '${req.body.serviceId}'`
      );
    }

    const serviceName = getServiceResult[0].serviceName;

    const insertSql = mysql.format(
      `
        INSERT INTO clientInteractions
        (clientId, serviceId, interactionType, dateOfInteraction, duration, location, addedBy, modifiedBy)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?);

        SET @interactionId := LAST_INSERT_ID();

        INSERT INTO clientLogs
        (clientId, title, description, logType, addedBy, detailId)
        VALUES (?, ?, ?, ?, ?, @interactionId);

        INSERT INTO clientLogs
        (clientId, title, description, logType, addedBy, dateAdded, detailId)
        VALUES (?, ?, ?, ?, ?, ?, @interactionId);

        ${insertTagsQuery(
          { rawValue: "@interactionId" },
          "clientInteractions",
          req.query.tags || []
        )}
      `,
      [
        req.params.clientId,
        req.body.serviceId,
        req.body.interactionType,
        req.body.dateOfInteraction,
        req.body.duration,
        req.body.location,
        user.id,
        user.id,
        req.params.clientId,
        `${serviceName} service added`,
        req.body.description,
        "clientInteraction:created",
        user.id,
        req.params.clientId,
        `${serviceName} service was provided`,
        null,
        "clientInteraction:serviceProvided",
        user.id,
        req.body.dateOfInteraction,
      ]
    );

    pool.query(insertSql, (err, result) => {
      if (err) {
        return databaseError(req, res, err);
      }

      getInteraction(
        result[0].insertId,
        Number(req.params.clientId),
        (err, interaction) => {
          if (err) {
            return err(req, res);
          }

          res.send(interaction);
        }
      );
    });
  });
});
