const {
  app,
  invalidRequest,
  notFound,
  internalError,
  databaseError,
  pool,
} = require("../../../server");
const mysql = require("mysql");
const { checkValid, validId } = require("../../utils/validation-utils");

app.delete("/api/clients/:clientId/files/:fileId", (req, res) => {
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
    SELECT s3Key, fileName FROM clientFiles WHERE clientId = ? AND id = ? AND isDeleted = false;
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

    const deleteSql = mysql.format(
      `
      UPDATE clientFiles SET isDeleted = true WHERE id = ?;
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
