const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound,
} = require("../../../server");
const mariadb = require("mariadb/callback.js");
const { checkValid, validId } = require("../../utils/validation-utils");
const { modifiableLogTypes } = require("./activity-log.utils");

app.delete("/api/clients/:clientId/logs/:logId", (req, res) => {
  const validationErrors = checkValid(req.params, validId("clientId", "logId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const clientId = Number(req.params.clientId);
  const logId = Number(req.params.logId);

  const inClause = modifiableLogTypes
    .map((logType) => `'${logType}'`)
    .join(", ");

  const deleteLogsQuery = mariadb.format(
    `
    WITH RECURSIVE allConnectedLogs (id, idOfUpdatedLog) AS (
      SELECT id, idOfUpdatedLog
      FROM clientLogs
      WHERE id = ?
      UNION ALL
      SELECT clientLogs.id, clientLogs.idOfUpdatedLog
      FROM clientLogs JOIN allConnectedLogs ON clientLogs.idOfUpdatedLog = allConnectedLogs.id
    )

    UPDATE clientLogs
    SET isDeleted = true
    WHERE
      id IN (SELECT id from allConnectedLogs) AND
      clientId = ? AND
      addedBy = ? AND
      logType IN (${inClause})
    `,
    [logId, clientId, req.session.passport.user.id]
  );

  pool.query(deleteLogsQuery, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (result.affectedRows > 0) {
      res.status(204).end();
    } else {
      const getLogQuery = mariadb.format(
        `
        SELECT * FROM clientLogs WHERE id = ? AND clientId = ?;
        `,
        [logId, clientId]
      );

      pool.query(getLogQuery, (err, result) => {
        if (err) {
          return databaseError(req, res, err);
        }

        if (result.length === 0) {
          invalidRequest(
            res,
            `No client log with id '${logId}' for client '${clientId}'.`
          );
        } else {
          const row = result[0];
          if (row.addedBy !== req.session.passport.user.id) {
            invalidRequest(
              res,
              `Cannot delete log entry that you didn't create.`
            );
          } else if (
            !modifiableLogTypes.some((logType) => logType === row.logType)
          ) {
            invalidRequest(res, `Log type '${row.logType}' cannot be deleted.`);
          } else {
            res.status(500).send({
              error: "Unknown error while deleting client log entry",
            });
          }
        }
      });
    }
  });
});
