const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound,
} = require("../../../server");
const mysql = require("mysql");
const {
  checkValid,
  validId,
  validEnum,
  nonEmptyString,
} = require("../../utils/validation-utils");
const {
  modifiableLogTypes,
  createResponseLogObject,
} = require("./activity-log.utils");

app.post("/clients/:clientId/logs", (req, res) => {
  const validationErrors = [
    ...checkValid(req.params, validId("clientId")),
    ...checkValid(
      req.body,
      validEnum("logType", ...modifiableLogTypes),
      nonEmptyString("title"),
      nonEmptyString("description")
    ),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const user = req.session.passport.user;

  const sql = mysql.format(
    `
    INSERT INTO clientLogs
    (clientId, title, description, logType, addedBy)
    VALUES
    (?, ?, ?, ?, ?)
  `,
    [
      req.params.clientId,
      req.body.title,
      req.body.description,
      req.body.logType,
      user.id,
    ]
  );

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
