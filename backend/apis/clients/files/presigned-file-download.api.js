const {
  app,
  invalidRequest,
  notFound,
  internalError,
  databaseError,
  pool,
} = require("../../../server");
const AWS = require("aws-sdk");
const mysql = require("mysql");
const { checkValid, validId } = require("../../utils/validation-utils");
const { Bucket } = require("./file-helpers");

app.get("/api/clients/:clientId/files/:fileId/signed-downloads", (req, res) => {
  const validationErrors = checkValid(
    req.params,
    validId("clientId"),
    validId("fileId")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const clientId = Number(req.params.clientId);
  const fileId = Number(req.params.fileId);

  const getSql = mysql.format(
    `
    SELECT isDeleted FROM clients WHERE id = ?;
    SELECT s3Key, fileName FROM clientFiles WHERE clientId = ? AND id = ?;
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

    const { s3Key, fileName } = fileResult[0];

    AWS.config.getCredentials((err, data) => {
      if (err) {
        return internalError(req, res, err);
      }

      const s3 = new AWS.S3();
      s3.getSignedUrl(
        "getObject",
        {
          Bucket,
          Key: s3Key,
          Expires: 120,
          ResponseContentDisposition: `attachment; filename="${fileName}"`,
        },
        (err, url) => {
          if (err) {
            return internalError(req, res, err);
          }

          res.send({
            downloadUrl: url,
          });
        }
      );
    });
  });
});
