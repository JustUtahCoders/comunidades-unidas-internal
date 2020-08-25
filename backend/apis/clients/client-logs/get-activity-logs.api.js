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
  nullableValidTags,
} = require("../../utils/validation-utils");
const { createResponseLogObject } = require("./activity-log.utils");
const { validTagsList, sanitizeTags } = require("../../tags/tag.utils");

app.get("/api/clients/:clientId/logs", (req, res, next) => {
  const validationErrors = [
    ...checkValid(req.params, validId("clientId")),
    ...checkValid(
      req.query,
      nullableValidTags("tags", req.session.passport.user.permissions)
    ),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const getLogsQuery = mysql.format(
    `
    SELECT
      clientLogs.id, clientLogs.title, clientLogs.description, clientLogs.logType, clientLogs.dateAdded, clientLogs.detailId, clientLogs.idOfUpdatedLog,
      users.id createdById, users.firstName createdByFirstName, users.lastName createdByLastName,
      JSON_ARRAYAGG(JSON_OBJECT('tag', tags.tag, 'foreignTable', tags.foreignTable)) tags
    FROM
      clientLogs LEFT JOIN tags ON tags.foreignId = clientLogs.id JOIN users ON clientLogs.addedBy = users.id 
    WHERE clientLogs.clientId = ? AND clientLogs.isDeleted = false
    GROUP BY clientLogs.id
    ORDER BY clientLogs.dateAdded DESC, clientLogs.logType DESC
    LIMIT 200
  `,
    [req.params.clientId]
  );

  pool.query(getLogsQuery, (err, logs) => {
    if (err) {
      return databaseError(req, res, err);
    }

    console.log("logs", logs);

    logs.forEach((log) => {
      log.tags = JSON.parse(log.tags).filter(
        (t) => t.foreignTable === "clientLogs"
      );
    });

    const tags = sanitizeTags(req.query.tags);
    const redactedTags = validTagsList.filter((t) => !tags.includes(t));

    res.send({
      logs: logs.map((l) => createResponseLogObject(l, redactedTags)),
    });
  });
});
