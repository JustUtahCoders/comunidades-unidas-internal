const { app, pool, invalidRequest, databaseError } = require("../../../server");
const {
  checkValid,
  validId,
  nullableValidTags,
  nullableNonEmptyString,
} = require("../../utils/validation-utils");
const mariadb = require("mariadb");
const {
  modifiableLogTypes,
  insertActivityLogQuery,
} = require("./activity-log.utils");
const { sanitizeTags } = require("../../tags/tag.utils");

app.patch(`/api/clients/:clientId/logs/:logId`, (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.params, validId("clientId"), validId("logId")),
    ...checkValid(
      req.body,
      nullableNonEmptyString("title"),
      nullableNonEmptyString("description")
    ),
    ...checkValid(req.query, nullableValidTags("tags", user.permissions)),
  ];

  if (req.body.logType) {
    validationErrors.push("logType may not be modified");
  }

  if (validationErrors.length) {
    return invalidRequest(res, validationErrors);
  }

  const tags = sanitizeTags(req.query.tags);

  const selectSql = mariadb.format(
    `SELECT * FROM clientLogs WHERE clientId = ? AND id = ?`,
    [req.params.clientId, req.params.logId]
  );

  pool.query(selectSql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (result.length === 0) {
      return invalidRequest(
        res,
        `No client log exists for client ${req.params.clientId} and log ${req.params.logId}`
      );
    } else {
      const existingLog = result[0];

      if (existingLog.addedBy !== user.id) {
        return invalidRequest(
          res,
          `You may not modify a client log that you did not create`
        );
      }

      if (
        !modifiableLogTypes.some((logType) => logType === existingLog.logType)
      ) {
        return invalidRequest(
          res,
          `You may not modify client logs with logType '${existingLog.logType}'`
        );
      }

      if (existingLog.isDeleted) {
        return invalidRequest(
          res,
          `You may not modify a client log that is deleted`
        );
      }

      if (existingLog.idOfUpdatedLog) {
        return invalidRequest(res, `You may not modify an outdated client log`);
      }

      const updateSql = mariadb.format(
        `
        ${insertActivityLogQuery({
          clientId: req.params.clientId,
          title: req.body.title || existingLog.title,
          description: req.body.description || existingLog.description,
          logType: existingLog.logType,
          addedBy: user.id,
          tags,
        })}

        UPDATE clientLogs SET idOfUpdatedLog = LAST_INSERT_ID() WHERE id = ?;
      `,
        [existingLog.id]
      );

      pool.query(updateSql, (err, result) => {
        if (err) {
          return databaseError(req, res, err);
        }

        return res.status(204).end();
      });
    }
  });
});
