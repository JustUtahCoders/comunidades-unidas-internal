const { app, databaseError, pool, invalidRequest } = require("../../../server");
const mysql = require("mysql");
const { checkValid, validId } = require("../../utils/validation-utils");
const { integrationTypes } = require("./integrations-utils");
const { getClientById } = require("../get-client.api");

app.get(`/api/clients/:clientId/integrations`, (req, res) => {
  const validationErrors = checkValid(req.params, validId("clientId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const clientId = Number(req.params.clientId);

  getClientById(clientId, (err, client) => {
    if (err) {
      return databaseError(err);
    }

    if (!client) {
      return res
        .status(404)
        .send({ error: `Could not find client with id ${clientId}` });
    }

    const sql = mysql.format(
      `
      SELECT * FROM integrations WHERE clientId = ?;
    `,
      [clientId]
    );

    pool.query(sql, (err, data) => {
      if (err) {
        return databaseError(req, res, err);
      }

      res.send(
        Object.entries(integrationTypes).map(([id, name]) => {
          const { status, lastSync, externalId } = data.find(
            d => d.integrationType === id
          ) || { status: "disabled", lastSync: null, externalId: null };
          return {
            id,
            name,
            status,
            lastSync,
            externalId
          };
        })
      );
    });
  });
});
