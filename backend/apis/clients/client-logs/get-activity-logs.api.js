const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound
} = require("../../../server");
const mysql = require("mysql");
const { checkValid, validId } = require("../../utils/validation-utils");
const { createResponseLogObject } = require("./activity-log.utils");

app.get("/api/clients/:clientId/logs", (req, res, next) => {
  const validationErrors = checkValid(req.params, validId("clientId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const getLogsQuery = mysql.format(
    `
    SELECT
      clientLogs.id, clientLogs.title, clientLogs.description, clientLogs.logType, clientLogs.dateAdded, clientLogs.detailId, clientLogs.idOfUpdatedLog,
      users.id createdById, users.firstName createdByFirstName, users.lastName createdByLastName
    FROM clientLogs JOIN users
    ON clientLogs.addedBy = users.id
    WHERE clientLogs.clientId = ? AND isDeleted = false
    ORDER BY clientLogs.dateAdded DESC, clientLogs.logType DESC
    LIMIT 200
  `,
    [req.params.clientId]
  );

  pool.query(getLogsQuery, (err, logs) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (logs.length === 0) {
      notFound(res, `Client ${req.params.clientId}`);
    } else {
      res.send({
        logs: logs.map(createResponseLogObject)
      });
    }
  });
});
