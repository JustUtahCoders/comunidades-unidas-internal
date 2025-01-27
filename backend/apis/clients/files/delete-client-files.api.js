const {
  app,
  invalidRequest,
  notFound,
  internalError,
  databaseError,
  insufficientPrivileges,
  pool,
} = require("../../../server");
const mysql = require("mysql2");
const {
  checkValid,
  validId,
  nullableValidTags,
} = require("../../utils/validation-utils");
const { validTagsList, sanitizeTags } = require("../../tags/tag.utils");
const { insertActivityLogQuery } = require("../client-logs/activity-log.utils");

app.delete("/api/clients/:clientId/files/:fileId", (req, res) => {
  const user = req.session.passport.user;
  const validationErrors = [
    ...checkValid(req.params, validId("clientId"), validId("fileId")),
    ...checkValid(req.query, nullableValidTags("tags", user.permissions)),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const clientId = Number(req.params.clientId);
  const fileId = Number(req.params.fileId);
  const tags = sanitizeTags(req.query.tags);
  const redactedTags = validTagsList.filter((t) => !tags.includes(t));

  const getSql = mysql.format(
    `
    SELECT isDeleted FROM clients WHERE id = ? AND isDeleted = false;

    SELECT JSON_ARRAYAGG(tags.tag) tags, fileName
    FROM clientFiles LEFT JOIN tags ON tags.foreignId = clientFiles.id AND (tags.foreignTable = 'clientFiles' OR tags.foreignTable IS NULL)
    WHERE clientFiles.clientId = ? AND clientFiles.id = ? AND clientFiles.isDeleted = false
    GROUP BY clientFiles.id
    `,
    [clientId, clientId, fileId]
  );

  pool.query(getSql, (err, sqlResult) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [clientResult, fileResult] = sqlResult;
    if (clientResult.length === 0) {
      return notFound(res, `There is no client with id ${clientId}`);
    }

    if (fileResult.length === 0) {
      return notFound(
        res,
        `There is no file with id ${fileId} for client ${clientId}`
      );
    }

    let { tags: fileTags } = fileResult[0];

    if (typeof fileTags === "string") {
      fileTags = JSON.parse(fileTags);
    }

    const cannotDownload = fileTags.some((t) => redactedTags.includes(t));

    if (cannotDownload) {
      return insufficientPrivileges(
        res,
        `Cannot delete this file - insufficient permissions`
      );
    }

    const deleteSql = mysql.format(
      `
      UPDATE clientFiles SET isDeleted = true WHERE id = ?;

      ${insertActivityLogQuery({
        clientId,
        title: `The ${fileResult[0].fileName} file was deleted`,
        description: null,
        logType: "file:deleted",
        addedBy: user.id,
        detailId: fileId,
        tags,
      })}
      `,
      [fileId]
    );

    pool.query(deleteSql, (err, result) => {
      if (err) {
        return databaseError(req, res, err);
      }

      res.status(204).end();
    });
  });
});
