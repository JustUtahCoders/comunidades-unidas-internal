const { upsertClient } = require("juntos-por-la-salud-node-client");

module.exports = function juntosPorLaSalud(integration, client) {
  return upsertClient({
    client,
    participantId: integration.externalId,
    username: process.env.JPLS_USERNAME,
    password: process.env.JPLS_PASSWORD
  }).then(
    result => ({
      error: null
    }),
    error => ({
      error
    })
  );
};
