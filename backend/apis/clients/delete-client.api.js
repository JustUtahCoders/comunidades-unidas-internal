const { app, pool, invalidRequest, databaseError } = require("../../server");
const mysql = require("mysql");
const { checkValid, validId } = require("../utils/validation-utils");
const { getClientById } = require("./get-client.api");
const { insertActivityLogQuery } = require("./client-logs/activity-log.utils");

app.delete("/api/clients/:clientId", (req, res) => {
  const validationErrors = checkValid(req.params, validId("clientId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const userId = req.session.passport.user.id;

  const clientId = Number(req.params.clientId);

  getClientById(clientId, (err, data, fields) => {
    if (err) {
      return invalidRequest(res, err);
    }

    if (!data) {
      return invalidRequest(res, `Client ${clientId} does not exist`);
    }

    const sql = mysql.format(
      `
        UPDATE clients
        SET isDeleted = true
        WHERE id = ?;

        ${insertActivityLogQuery({
          clientId: clientId,
          title: `Client was deleted`,
          description: null,
          logType: "clientDeleted",
          addedBy: userId
        })}
    `,
      [clientId]
    );

    pool.query(sql, (err, result) => {
      if (err) {
        return databaseError(req, res, err);
      }

      res.status(204).end();
    });
  });
});
