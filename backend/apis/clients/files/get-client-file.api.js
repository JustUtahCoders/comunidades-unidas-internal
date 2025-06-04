const {
  app,
  invalidRequest,
  databaseError,
  pool,
  notFound,
} = require("../../../server");
const {
  checkValid,
  validId,
  nullableValidTags,
} = require("../../utils/validation-utils");
const { responseFullName } = require("../../utils/transform-utils");
const mariadb = require("mariadb/callback.js");
const { validTagsList, sanitizeTags } = require("../../tags/tag.utils");

app.get("/api/clients/:clientId/files/:fileId", (req, res) => {
  const validationErrors = [
    ...checkValid(req.params, validId("clientId"), validId("fileId")),
    ...checkValid(
      req.query,
      nullableValidTags("tags", req.session.passport.user.permissions)
    ),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const clientId = Number(req.params.clientId);
  const fileId = Number(req.params.fileId);
  const tags = sanitizeTags(req.query.tags);
  const redactedTags = validTagsList.filter((t) => !tags.includes(t));

  const checkClientSql = mariadb.format(
    `
    SELECT isDeleted FROM clients WHERE id = ?
  `,
    [clientId]
  );

  pool.query(checkClientSql, (err, checkClientResult) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (checkClientResult.length === 0) {
      return res
        .status(404)
        .send({ errors: ["No such client with id " + clientId] });
    }

    const getFileSql = mariadb.format(
      `
      SELECT clientFiles.id, clientFiles.fileName, clientFiles.fileSize, clientFiles.fileExtension,
        clientFiles.dateAdded, users.firstName, users.lastName, JSON_ARRAYAGG(tags.tag) tags
      FROM
        clientFiles
        JOIN users ON users.id = clientFiles.addedBy
        LEFT JOIN tags on tags.foreignId = clientFiles.id AND (tags.foreignTable = 'clientFiles' OR tags.foreignTable IS NULL)
      WHERE isDeleted = false AND clientId = ? AND clientFiles.id = ?
      GROUP BY clientFiles.id
      ORDER BY clientFiles.dateAdded ASC
      ;
    `,
      [clientId, fileId]
    );

    pool.query(getFileSql, (err, result) => {
      if (err) {
        return databaseError(err);
      }

      const f = result[0];

      if (!f) {
        return notFound(res, `No file found with id ${fileId}`);
      }

      if (typeof f.tags === "string") {
        f.tags = JSON.parse(f.tags);
      }

      const redact = f.tags.some((t) => redactedTags.includes(t));

      res.send({
        id: f.id,
        fileName: redact ? "" : f.fileName,
        fileSize: redact ? 0 : f.fileSize,
        fileExtension: f.fileExtension,
        createdBy: {
          firstName: f.firstName,
          lastName: f.lastName,
          fullName: responseFullName(f.firstName, f.lastName),
          timestamp: f.dateAdded,
        },
        redacted: Boolean(redact),
      });
    });
  });
});
