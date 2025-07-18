const { app, databaseError, pool, invalidRequest } = require("../../../server");
const {
  checkValid,
  validId,
  validEnum,
  nonEmptyString,
  nullableValidTags,
} = require("../../utils/validation-utils");
const {
  modifiableLogTypes,
  createResponseLogObject,
  insertActivityLogQuery,
} = require("./activity-log.utils");
const { sanitizeTags } = require("../../tags/tag.utils");
const { runQueriesArray } = require("../../utils/mariadb-utils.js");

app.post("/api/clients/:clientId/logs", (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.params, validId("clientId")),
    ...checkValid(
      req.body,
      validEnum("logType", ...modifiableLogTypes),
      nonEmptyString("title"),
      nonEmptyString("description")
    ),
    ...checkValid(req.query, nullableValidTags("tags", user.permissions)),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const tags = sanitizeTags(req.query.tags);

  const queries = insertActivityLogQuery({
    clientId: req.params.clientId,
    title: req.body.title,
    description: req.body.description,
    logType: req.body.logType,
    addedBy: user.id,
    tags,
  });

  console.log("queries", queries);

  runQueriesArray(queries, (err, results) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [result] = results;

    res.send(
      createResponseLogObject({
        id: result.id,
        title: req.body.title,
        description: req.body.description,
        logType: req.body.logType,
        isDeleted: false,
        createdById: user.id,
        createdByFirstName: user.firstName,
        createdByLastName: user.lastName,
        dateAdded: new Date(),
      })
    );
  });
});
