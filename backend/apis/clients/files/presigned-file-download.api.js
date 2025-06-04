const {
  app,
  invalidRequest,
  notFound,
  internalError,
  databaseError,
  insufficientPrivileges,
  pool,
} = require("../../../server");
const AWS = require("aws-sdk");
const mariadb = require("mariadb");
const {
  checkValid,
  validId,
  nullableValidTags,
  nullableNonEmptyString,
} = require("../../utils/validation-utils");
const { Bucket } = require("./file-helpers");
const { validTagsList, sanitizeTags } = require("../../tags/tag.utils");

app.get("/api/clients/:clientId/files/:fileId/signed-downloads", (req, res) => {
  const validationErrors = [
    ...checkValid(req.params, validId("clientId"), validId("fileId")),
    ...checkValid(
      req.query,
      nullableValidTags("tags", req.session.passport.user.permissions),
      nullableNonEmptyString("contentDisposition"),
      nullableNonEmptyString("contentType")
    ),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const clientId = Number(req.params.clientId);
  const fileId = Number(req.params.fileId);
  const tags = sanitizeTags(req.query.tags);
  const redactedTags = validTagsList.filter((t) => !tags.includes(t));

  const getSql = mariadb.format(
    `
    SELECT isDeleted FROM clients WHERE id = ? AND isDeleted = false;

    SELECT s3Key, fileName, JSON_ARRAYAGG(tags.tag) tags
    FROM clientFiles LEFT JOIN tags ON tags.foreignId = clientFiles.id AND (tags.foreignTable = 'clientFiles' OR tags.foreignTable IS NULL)
    WHERE clientFiles.clientId = ? AND clientFiles.id = ? AND clientFiles.isDeleted = false
    GROUP BY clientFiles.id
    ;
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

    let { s3Key, fileName, tags: fileTags } = fileResult[0];

    if (typeof fileTags === "string") {
      fileTags = JSON.parse(fileTags);
    }

    const cannotDownload = fileTags.some((t) => redactedTags.includes(t));

    if (cannotDownload) {
      return insufficientPrivileges(
        res,
        `Cannot download this file - insufficient permissions`
      );
    }

    AWS.config.getCredentials((err, data) => {
      if (err) {
        return internalError(req, res, err);
      }

      const params = {
        Bucket,
        Key: s3Key,
        Expires: 120,
        ResponseContentType: req.query.contentType
          ? req.query.contentType
          : undefined,
        ResponseContentDisposition: req.query.contentDisposition
          ? req.query.contentDisposition
          : undefined,
      };

      const s3 = new AWS.S3();
      s3.getSignedUrl("getObject", params, (err, url) => {
        if (err) {
          return internalError(req, res, err);
        }

        res.send({
          downloadUrl: url,
        });
      });
    });
  });
});
