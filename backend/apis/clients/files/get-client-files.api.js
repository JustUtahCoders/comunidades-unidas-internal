const {
  app,
  internalError,
  invalidRequest,
  databaseError,
  pool,
} = require("../../../server");
const AWS = require("aws-sdk");
const { checkValid, validId } = require("../../utils/validation-utils");
const { responseFullName } = require("../../utils/transform-utils");
const mysql = require("mysql");

app.get("/api/clients/:clientId/files", (req, res) => {
  const validationErrors = [...checkValid(req.params, validId("clientId"))];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const clientId = Number(req.params.clientId);

  const checkClientSql = mysql.format(
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

    const getFilesSql = mysql.format(
      `
      SELECT clientFiles.id, clientFiles.fileName, clientFiles.fileSize, clientFiles.fileExtension,
        clientFiles.dateAdded, users.firstName, users.lastName
      FROM clientFiles JOIN users ON users.id = clientFiles.addedBy
      WHERE isDeleted = false AND clientId = ?;
    `,
      [clientId]
    );

    pool.query(getFilesSql, (err, result) => {
      if (err) {
        return databaseError(err);
      }

      res.send({
        files: result.map((f) => ({
          id: f.id,
          fileName: f.fileName,
          fileSize: f.fileSize,
          fileExtension: f.fileExtension,
          createdBy: {
            firstName: f.firstName,
            lastName: f.lastName,
            fullName: responseFullName(f.firstName, f.lastName),
            timestamp: f.dateAdded,
          },
        })),
      });
    });
  });
});
