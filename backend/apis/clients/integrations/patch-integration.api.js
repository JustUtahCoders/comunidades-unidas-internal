const { app, pool, invalidRequest, databaseError } = require("../../../server");
const {
  checkValid,
  validId,
  validEnum,
  nullableValidEnum,
  nullableNonEmptyString
} = require("../../utils/validation-utils");
const { getClientById } = require("../get-client.api");
const {
  integrationTypes,
  getIntegrationName
} = require("./integrations-utils");
const mysql = require("mysql");

app.patch("/api/clients/:clientId/integrations/:integrationId", (req, res) => {
  const validationErrors = [
    ...checkValid(
      req.params,
      validId("clientId"),
      validEnum("integrationId", ...Object.keys(integrationTypes))
    ),
    ...checkValid(
      req.body,
      nullableNonEmptyString("externalId"),
      nullableValidEnum("status", "disabled", "enabled", "broken")
    )
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const clientId = Number(req.params.clientId);
  const integrationId = req.params.integrationId;

  getClientById(clientId, (err, client) => {
    if (err) {
      return databaseError(rewq, res, err);
    }

    if (!client) {
      return res
        .status(404)
        .send({ error: `Could not find client with id ${clientId}` });
    }

    const getExistingSql = mysql.format(
      `SELECT * FROM integrations WHERE clientId = ? AND integrationType = ?`,
      [clientId, integrationId]
    );
    pool.query(getExistingSql, (err, existingIntegration = {}) => {
      if (err) {
        return databaseError(req, res, err);
      }

      const finalIntegration = {
        id: integrationId,
        name: getIntegrationName(integrationId),
        status: req.body.status || existingIntegration.status || "disabled",
        lastSync: new Date(),
        externalId:
          req.body.externalId || existingIntegration.externalId || null
      };

      let upsertSql;
      if (existingIntegration.length === 1) {
        upsertSql = mysql.format(
          `
          UPDATE integrations SET status = ?, lastSync = CURRENT_TIMESTAMP(), externalId = ?;
        `,
          [finalIntegration.status, finalIntegration.externalId]
        );
      } else {
        upsertSql = mysql.format(
          `
          INSERT INTO integrations (clientId, integrationType, status, externalId, lastSync) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP());
        `,
          [
            clientId,
            integrationId,
            finalIntegration.status,
            finalIntegration.externalId
          ]
        );
      }

      pool.query(upsertSql, (err, result) => {
        if (err) {
          return databaseError(req, res, err);
        }

        res.send(finalIntegration);
      });
    });
  });
});
