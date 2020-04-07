const { app, pool, invalidRequest, databaseError } = require("../../../server");
const {
  checkValid,
  validId,
  nullableNonEmptyString,
} = require("../../utils/validation-utils");
const mysql = require("mysql");
const { modifiableLogTypes } = require("./activity-log.utils");

app.patch(`/api/clients/:clientId/logs/:logId`, (req, res) => {
  const validationErrors = [
    ...checkValid(req.params, validId("clientId"), validId("logId")),
    ...checkValid(
      req.body,
      nullableNonEmptyString("title"),
      nullableNonEmptyString("description")
    ),
  ];

  if (req.body.logType) {
    validationErrors.push("logType may not be modified");
  }

  if (validationErrors.length) {
    return invalidRequest(res, validationErrors);
  }

  const selectSql = mysql.format(
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

      if (existingLog.addedBy !== req.session.passport.user.id) {
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

      const updateSql = mysql.format(
        `
        INSERT INTO clientLogs
        (clientId, title, description, logType, addedBy)
        VALUES
        (?, ?, ?, ?, ?);

        UPDATE clientLogs SET idOfUpdatedLog = LAST_INSERT_ID() WHERE id = ?;
        `,
        [
          req.params.clientId,
          req.body.title || existingLog.title,
          req.body.description || existingLog.description,
          existingLog.logType,
          req.session.passport.user.id,
          existingLog.id,
        ]
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
