const { pool } = require("../../../server");
const mysql = require("mysql");
const integrateJpls = require("./jpls-integration");
const { insertActivityLogQuery } = require("../client-logs/activity-log.utils");

const integrationTypes = {
  JPLS: {
    name: "Juntos Por La Salud",
    integrate: integrateJpls,
  },
};

exports.getIntegrationTypes = function getIntegrationTypes() {
  return Object.keys(integrationTypes);
};

exports.getIntegrationName = getIntegrationName;

exports.performIntegration = performIntegration;

exports.performAnyIntegrations = function performAnyIntegrations(
  client,
  userId
) {
  const clientId = client.id;
  // These are done in the background and are not part of the synchronous HTTP request.
  // If they fail, we note this in the client log and by changing the integration's status to 'broken'

  const getActiveIntegrationsSql = mysql.format(
    `SELECT * FROM integrations WHERE clientId = ? AND status = 'enabled'`,
    [clientId]
  );
  pool.query(getActiveIntegrationsSql, (err, integrations) => {
    if (err) {
      console.error(err);
      createClientLog({
        clientId,
        title: `All integrations with third party systems are broken`,
        logType: "integration:broken",
        addedBy: userId,
      });
      return;
    }

    integrations.forEach((integration) => {
      performIntegration(integration, client)
        .then((result) => {
          if (result.error) {
            pool.query(
              `UPDATE integrations SET status = 'broken' WHERE clientId = ? AND integrationType = ?`,
              [clientId, integration.integrationType],
              (err) => {
                if (err) {
                  createClientLog({
                    clientId,
                    title: `Integration ${getIntegrationName(
                      integration.integrationType
                    )} could not be updated to broken status`,
                    logType: "integration:broken",
                    addedBy: userId,
                  });
                  console.error(err);
                }
              }
            );
          }

          logIntegrationResult(clientId, integration, result, userId);
        })
        .catch((err) => {
          createClientLog({
            clientId,
            title: `Integration ${getIntegrationName(
              integration.integrationType
            )} is broken`,
            logType: "integration:broken",
            addedBy: userId,
          });
          console.error(err);
        });
    });
  });
};

exports.logIntegrationResult = logIntegrationResult;

function logIntegrationResult(
  clientId,
  integration,
  result,
  userId,
  statusChanged = false
) {
  if (result.error) {
    console.error("\n------------ Integration API error ------------");
    console.error(
      `For client ${clientId} and integration type ${integration.integrationType} with externalId ${integration.externalId}`
    );
    console.error("\nError message:");
    console.error(result.error);
    console.error("\nFull logs:");
    console.error(result.fullLogs);
    console.error("-----------------------------------------------");
    createClientLog({
      clientId,
      title: `${getIntegrationName(
        integration.integrationType
      )} integration didn't work`,
      logType: "integration:sync",
      addedBy: userId,
    });
  } else {
    if (statusChanged) {
      createClientLog({
        clientId,
        title: `${getIntegrationName(
          integration.integrationType
        )} integration was ${integration.status}`,
        logType: `integration:${integration.status}`,
        addedBy: userId,
      });
    } else {
      createClientLog({
        clientId,
        title: `${getIntegrationName(
          integration.integrationType
        )} integration was synced`,
        logType: "integration:sync",
        addedBy: userId,
      });
    }
  }
}

function performIntegration(integration, client) {
  if (integration.status === "enabled") {
    const integrationInfo = integrationTypes[integration.integrationType];
    if (!integrationInfo) {
      throw Error(
        `Server not implemented to perform integration with integration type '${integration.integrationType}'`
      );
    }
    return integrationInfo.integrate(integration, client);
  } else {
    return Promise.resolve({ error: null });
  }
}

function createClientLog(params) {
  pool.query(insertActivityLogQuery(params), (err) => {
    console.error(err);
  });
}

function getIntegrationName(type) {
  const info = integrationTypes[type];
  if (!info) {
    throw Error(
      `No integration name implemented for integration of type '${type}'`
    );
  }
  return info.name;
}
