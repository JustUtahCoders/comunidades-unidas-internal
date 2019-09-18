const { pool } = require("../../../server");
const mysql = require("mysql");
const integrateJpls = require("./jpls-integration");

const integrationTypes = {
  JPLS: {
    name: "Juntos Por La Salud",
    integrate: integrateJpls
  }
};

exports.getIntegrationTypes = function getIntegrationTypes() {
  return Object.keys(integrationTypes);
};

exports.getIntegrationName = function getIntegrationName(type) {
  const name = integrationTypes[type];
  if (!name) {
    throw Error(
      `No integration name implemented for integration of type '${type}'`
    );
  }
  return name;
};

exports.performIntegration = performIntegration;

exports.performAnyIntegrations = function performAnyIntegrations(clientId) {
  // These are done in the background and are not part of the synchronous HTTP request.
  // If they fail, we note this in the client log and by changing the integration's status to 'broken'

  const getActiveIntegrationsSql = mysql.format(
    `SELECT * FROM integrations WHERE clientId = ? AND status = 'enabled'`,
    [clientId]
  );
  pool.query(getActiveIntegrationsSql, (err, integrations) => {
    if (err) {
      // TO-DO add this error to client log
      console.error(err);
      return;
    }

    integrations.forEach(integration => {
      performIntegration(integration)
        .then(result => {
          if (result.error) {
            pool.query(
              `UPDATE integrations SET status = 'broken' WHERE clientId = ? AND integrationType = ?`,
              [clientId, integration.integrationType],
              err => {
                if (err) {
                  // TO-DO add this error to client log
                  console.error(err);
                }
              }
            );
          }

          logIntegrationResult(clientId, integration, result);
        })
        .catch(err => {
          // TO-DO add this error to client log
          console.error(err);
        });
    });
  });
};

exports.logIntegrationResult = logIntegrationResult;

function logIntegrationResult(clientId, integration, result) {
  if (result.error) {
    console.error("------------ Integration API error ------------");
    console.error(
      `For client ${clientId} and integration type ${integration.integrationType} with externalId ${integration.externalId}`
    );
    console.error("\nError message:");
    console.error(result.error);
    console.error("\nFull logs:");
    console.error(result.fullLogs);
    console.error("-----------------------------------------------");
    // TO-DO insert into clientLogs table
  } else {
    // TO-DO insert into clientLogs table
  }
}

function performIntegration(integration) {
  if (integration.status === "enabled") {
    const integrationInfo = integrationTypes[integration.integrationType];
    if (!integrationInfo) {
      throw Error(
        `Server not implemented to perform integration with integration type '${integration.integrationType}'`
      );
    }
    return integrationInfo.integrate(integration);
  } else {
    return Promise.resolve({ error: null });
  }
}
