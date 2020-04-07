const { app, pool, invalidRequest, databaseError } = require("../../../server");
const mysql = require("mysql");
const { checkValid, validId } = require("../../utils/validation-utils");
const { getInteraction } = require("./client-interaction.utils");
const { insertActivityLogQuery } = require("../client-logs/activity-log.utils");

app.delete("/api/clients/:clientId/interactions/:interactionId", (req, res) => {
  const validationErrors = checkValid(
    req.params,
    validId("clientId"),
    validId("interactionId")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const interactionId = Number(req.params.interactionId);
  const clientId = Number(req.params.clientId);
  const userId = req.session.passport.user.id;

  getInteraction(interactionId, clientId, (err, interaction, serviceName) => {
    if (err) {
      return err(req, res);
    }

    const sql = mysql.format(
      `
        UPDATE clientInteractions
        SET isDeleted = true
        WHERE id = ?;

        UPDATE clientLogs
        SET isDeleted = true
        WHERE detailId = ?
          AND logType IN ("clientInteraction:created", "clientInteraction:updated");
        
        ${insertActivityLogQuery({
          clientId,
          title: `Client interaction for service ${serviceName} was deleted`,
          description: null,
          logType: "clientInteraction:deleted",
          addedBy: userId,
        })}
      `,
      [interactionId, interactionId]
    );

    pool.query(sql, (err, result) => {
      if (err) {
        return databaseError(req, res, err);
      }

      res.send({ isDeleted: true });
    });
  });
});
