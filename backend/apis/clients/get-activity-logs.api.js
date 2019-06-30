const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound
} = require("../../server");
const mysql = require("mysql");
const { checkValid, validId } = require("../utils/validation-utils");
const { responseFullName } = require("../utils/transform-utils");

const deletableLogTypes = ["caseNote", "clientUpdated:basicInformation"];

exports.deletableLogTypes = deletableLogTypes;

app.get("/api/clients/:clientId/logs", (req, res, next) => {
  const validationErrors = checkValid(req.params, validId("clientId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err, connection);
    }

    const getLogsQuery = mysql.format(
      `
      SELECT
        clientLogs.id, clientLogs.title, clientLogs.logType, clientLogs.dateAdded,
        users.id createdById, users.firstName createdByFirstName, users.lastName createdByLastName
      FROM clientLogs JOIN users
      ON clientLogs.addedBy = users.id
      WHERE clientLogs.clientId = ?
      ORDER BY dateAdded DESC
      LIMIT 200
    `,
      [req.params.clientId]
    );

    connection.query(getLogsQuery, (err, logs) => {
      if (err) {
        return databaseError(req, res, err, connection);
      }

      if (logs.length === 0) {
        notFound(res, `Client ${req.params.clientId}`);
      } else {
        res.send({
          logs: logs.map(log => ({
            id: log.id,
            title: log.title,
            logType: log.logType,
            canDelete: deletableLogTypes.some(
              logType => logType === log.logType
            ),
            isDeleted: Boolean(log.isDeleted),
            createdBy: {
              userId: log.createdById,
              firstName: log.createdByFirstName,
              lastName: log.createdByLastName,
              fullName: responseFullName(
                log.createdByFirstName,
                log.createdByLastName
              ),
              timestamp: log.dateAdded
            }
          }))
        });
      }

      connection.release();
    });
  });
});
