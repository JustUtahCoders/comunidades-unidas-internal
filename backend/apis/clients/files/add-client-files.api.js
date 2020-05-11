const {
  app,
  internalError,
  invalidRequest,
  databaseError,
  pool,
} = require("../../../server");
const AWS = require("aws-sdk");
const {
  checkValid,
  validId,
  nonEmptyString,
  validInteger,
} = require("../../utils/validation-utils");
const { Bucket } = require("./file-helpers");
const mysql = require("mysql");

app.post("/api/clients/:clientId/files", (req, res) => {
  const validationErrors = [
    ...checkValid(req.params, validId("clientId")),
    ...checkValid(
      req.body,
      nonEmptyString("s3Key"),
      nonEmptyString("fileName"),
      validInteger("fileSize"),
      nonEmptyString("fileExtension")
    ),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const user = req.session.passport.user;

  AWS.config.getCredentials((err, data) => {
    if (err) {
      return internalError(req, res, error);
    }

    const s3 = new AWS.S3();
    s3.headObject(
      {
        Bucket,
        Key: req.body.s3Key,
      },
      (err, data) => {
        if (err) {
          return internalError(req, res, error);
        }

        const insertSql = mysql.format(
          `
        INSERT INTO clientFiles (s3Key, fileName, fileSize, fileExtension, addedBy)
        VALUES (?, ?, ?, ?, ?);

        SELECT LAST_INSERT_ID();
      `,
          [
            req.body.s3Key,
            req.body.fileName,
            req.body.fileSize,
            req.body.fileExtension,
            user.id,
          ]
        );

        pool.query(insertSql, (err, result) => {
          if (err) {
            return databaseError(req, res, err);
          }

          const response = Object.assign({}, result, { id: result[1].id });

          res.json(response);
        });
      }
    );
  });
});
