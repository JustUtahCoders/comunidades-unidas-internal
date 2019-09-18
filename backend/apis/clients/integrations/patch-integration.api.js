const {
  app,
  pool,
  invalidRequest,
  databaseError,
  internalError,
  notFound
} = require("../../../server");
const {
  checkValid,
  validId,
  validEnum,
  nullableValidEnum,
  nullableNonEmptyString
} = require("../../utils/validation-utils");
const { getClientById } = require("../get-client.api");
const {
  getIntegrationTypes,
  getIntegrationName,
  performIntegration,
  logIntegrationResult
} = require("./integrations-utils");
const mysql = require("mysql");
const { insertActivityLogQuery } = require("../client-logs/activity-log.utils");

app.patch("/api/clients/:clientId/integrations/:integrationId", (req, res) => {
  const validationErrors = [
    ...checkValid(
      req.params,
      validId("clientId"),
      validEnum("integrationId", ...getIntegrationTypes())
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
  const userId = req.session.passport.user.id;

  getClientById(clientId, (err, client) => {
    if (err) {
      return databaseError(rewq, res, err);
    }

    if (!client) {
      return notFound(res, `Could not find client with id ${clientId}`);
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
        integrationType: integrationId,
        name: getIntegrationName(integrationId),
        status: req.body.status || existingIntegration.status || "disabled",
        lastSync: new Date(),
        externalId:
          req.body.externalId || existingIntegration.externalId || null
      };

      performIntegration(finalIntegration)
        .then(integrationResult => {
          logIntegrationResult(
            clientId,
            finalIntegration,
            integrationResult,
            userId
          );

          let upsertSql;
          if (existingIntegration.length === 1) {
            upsertSql = mysql.format(
              `
            UPDATE integrations SET status = ?, lastSync = CURRENT_TIMESTAMP(), externalId = ? WHERE clientId = ? AND integrationType = ?;
          `,
              [
                finalIntegration.status,
                finalIntegration.externalId,
                clientId,
                finalIntegration.integrationType
              ]
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

          if (integrationResult.error) {
            finalIntegration.status = "broken";
          }

          pool.query(upsertSql, (err, result) => {
            if (err) {
              return databaseError(req, res, err);
            }

            if (integrationResult.error) {
              internalError(req, res, integrationResult.error);
            } else {
              const clientLogSql = insertActivityLogQuery({
                clientId,
                title: `${getIntegrationName(
                  finalIntegration.integrationType
                )} integration was ${finalIntegration.status}`,
                logType: `integration:${finalIntegration.status}`,
                addedBy: userId
              });
              pool.query(clientLogSql, err => {
                if (err) {
                  return internalError(req, res, err);
                }

                res.send({
                  id: finalIntegration.integrationType,
                  name: finalIntegration.name,
                  status: finalIntegration.status,
                  externalId: finalIntegration.externalId,
                  lastSync: finalIntegration.lastSync
                });
              });
            }
          });
        })
        .catch(err => {
          internalError(req, res, err);
        });
    });
  });
});
