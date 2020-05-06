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

app.post("/clients/:clientId/logs", (req, res) => {
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

  const sql = insertActivityLogQuery({
    clientId: req.params.clientId,
    title: req.body.title,
    description: req.body.description,
    logType: req.body.logType,
    addedBy: user.id,
    tags,
  });

  console.log(sql);

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

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
