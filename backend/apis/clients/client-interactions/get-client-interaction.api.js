const { app, pool, invalidRequest, databaseError } = require("../../../server");
const { getInteraction } = require("./client-interaction.utils");
const {
  checkValid,
  validId,
  nullableValidTags,
} = require("../../utils/validation-utils");
const { validTagsList, sanitizeTags } = require("../../tags/tag.utils");

app.get("/api/clients/:clientId/interactions/:interactionId", (req, res) => {
  const validationErrors = [
    ...checkValid(req.params, validId("clientId"), validId("interactionId")),
    ...checkValid(
      req.query,
      nullableValidTags("tags", req.session.passport.user.permissions)
    ),
  ];

  const tags = sanitizeTags(req.query.tags);
  const redactedTags = validTagsList.filter((t) => !tags.includes(t));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const clientId = Number(req.params.clientId);
  const interactionId = Number(req.params.interactionId);

  getInteraction(
    interactionId,
    clientId,
    (err, interaction) => {
      if (err) {
        return err(req, res);
      }

      res.send(interaction);
    },
    redactedTags
  );
});
