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
  nullableValidTags,
} = require("../../utils/validation-utils");
const { responseFullName } = require("../../utils/transform-utils");
const { Bucket } = require("./file-helpers");
const mysql = require("mysql");
const { insertTagsQuery, sanitizeTags } = require("../../tags/tag.utils");
const { insertActivityLogQuery } = require("../client-logs/activity-log.utils");

app.post("/api/clients/:clientId/files", (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.params, validId("clientId")),
    ...checkValid(
      req.body,
      nonEmptyString("s3Key"),
      nonEmptyString("fileName"),
      validInteger("fileSize"),
      nonEmptyString("fileExtension")
    ),
    ...checkValid(req.query, nullableValidTags("tags", user.permissions)),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const clientId = req.params.clientId;
  const tags = sanitizeTags(req.query.tags);

  const checkClientSql = mysql.format(
    `
    SELECT isDeleted FROM clients WHERE id = ?;
  `,
    [clientId]
  );

  pool.query(checkClientSql, (err, checkClientResult) => {
    if (err) {
      return databaseError(err);
    }

    if (checkClientResult.length === 0) {
      return res
        .status(404)
        .send({ errors: ["No such client with id " + clientId] });
    }

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
          INSERT INTO clientFiles (s3Key, fileName, fileSize, fileExtension, addedBy, clientId)
          VALUES (?, ?, ?, ?, ?, ?);

          SET @clientFileId := LAST_INSERT_ID();

          SELECT @clientFileId id;

          ${insertTagsQuery({ rawValue: "@clientFileId" }, "clientFiles", tags)}

          ${insertActivityLogQuery({
            clientId,
            title: `The file ${req.body.fileName} was uploaded`,
            description: null,
            logType: "file:uploaded",
            addedBy: user.id,
            detailId: {
              rawValue: "@clientFileId",
            },
            tags,
          })}
        `,
            [
              req.body.s3Key,
              req.body.fileName,
              req.body.fileSize,
              req.body.fileExtension,
              user.id,
              clientId,
            ]
          );

          pool.query(insertSql, (err, result) => {
            if (err) {
              return databaseError(req, res, err);
            }

            res.json({
              id: result[2][0].id,
              s3Key: req.body.s3Key,
              fileSize: req.body.fileSize,
              fileExtension: req.body.fileExtension,
              createdBy: {
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: responseFullName(user.firstName, user.lastName),
                timestamp: new Date(),
              },
              redacted: false,
            });
          });
        }
      );
    });
  });
});
