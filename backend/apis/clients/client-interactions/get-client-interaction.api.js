const { app, pool, invalidRequest, databaseError } = require("../../../server");
const {
  createResponseInteractionObject
} = require("./client-interaction.utils");
const { checkValid, validId } = require("../../utils/validation-utils");
const mysql = require("mysql");

app.get("/api/clients/:clientId/interactions/:interactionId", (req, res) => {
  const validationErrors = checkValid(
    req.params,
    validId("clientId"),
    validId("interactionId")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const clientId = Number(req.params.clientId);
  const interactionId = Number(req.params.interactionId);

  const sql = mysql.format(
    `
      SELECT l.description, i.id, i.clientId, i.serviceId,
        i.interactionType, i.dateOfInteraction, i.duration,
        i.location, i.dateAdded, i.addedBy createdById, i.dateModified dateUpdated, i.modifiedBy lastUpdatedById,
        addedByUsers.firstName createdByFirstName, addedByUsers.lastName createdByLastName,
        modifiedByUsers.firstName lastUpdatedByFirstName, modifiedByUsers.lastName lastUpdatedByLastName
      FROM
        clientInteractions i
        JOIN clientLogs l ON l.detailId = i.id
        JOIN users addedByUsers ON addedByUsers.id = i.addedBy
        JOIN users modifiedByUsers ON modifiedByUsers.id = i.modifiedBy
      WHERE (
        i.id = ? AND
        l.logType IN ("clientInteraction:created", "clientInteraction:deleted") AND
        l.isDeleted = false AND
        i.isDeleted = false
      )
      ORDER BY l.dateAdded DESC
      LIMIT 1
    `,
    [interactionId]
  );

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (result.length === 0) {
      return res
        .status(404)
        .send({ error: `No interaction exists with id ${interactionId}` });
    }

    const row = result[0];

    if (row.clientId !== clientId) {
      return invalidRequest(
        res,
        `Interaction ${interactionId} is not for client ${clientId}`
      );
    }

    res.send(createResponseInteractionObject(row));
  });
});
