const { app, pool, invalidRequest, databaseError } = require("../../../server");
const { getInteraction } = require("./client-interaction.utils");
const { checkValid, validId } = require("../../utils/validation-utils");

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

  getInteraction(interactionId, clientId, (err, interaction) => {
    if (err) {
      return err(req, res);
    }

    res.send(interaction);
  });
});
