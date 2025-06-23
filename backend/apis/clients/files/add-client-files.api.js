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
  nonEmptyString,
  validInteger,
  nullableValidTags,
} = require("../../utils/validation-utils");
const { responseFullName } = require("../../utils/transform-utils");
const mariadb = require("mariadb/callback.js");
const { insertTagsQuery, sanitizeTags } = require("../../tags/tag.utils");
const { insertActivityLogQuery } = require("../client-logs/activity-log.utils");
const fs = require("fs");
const path = require("path");
const { runQueriesArray } = require("../../utils/mariadb-utils.js");

app.post("/api/clients/:clientId/files", (req, res) => {
  if (!process.env.FILE_STORAGE_PATH) {
    return internalError(req, res, "FILE_STORAGE_PATH not defined");
  }

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

  const checkClientSql = mariadb.format(
    `
    SELECT isDeleted FROM clients WHERE id = ?;
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

    if (
      !fs.existsSync(
        path.resolve(process.env.FILE_STORAGE_PATH, `./${req.body.s3Key}`)
      )
    ) {
      return notFound(res, `File was not uploaded to server`);
    }

    const queries = [];

    queries.push(
      mariadb.format(
        `
        INSERT INTO clientFiles (s3Key, fileName, fileSize, fileExtension, addedBy, clientId)
        VALUES (?, ?, ?, ?, ?, ?);

        SET @clientFileId := LAST_INSERT_ID();

        SELECT @clientFileId id;
      `,
        [
          req.body.s3Key,
          req.body.fileName,
          req.body.fileSize,
          req.body.fileExtension,
          user.id,
          clientId,
        ]
      )
    );

    queries.push(
      ...insertTagsQuery({ rawValue: "@clientFileId" }, "clientFiles", tags)
    );

    queries.push(
      ...insertActivityLogQuery({
        clientId,
        title: `The file ${req.body.fileName} was uploaded`,
        description: null,
        logType: "file:uploaded",
        addedBy: user.id,
        detailId: {
          rawValue: "@clientFileId",
        },
        tags,
      })
    );

    runQueriesArray(queries, (err, result) => {
      if (err) {
        return databaseError(req, res, err);
      }

      res.json({
        id: Number(result[0][0].insertId),
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
  });
});
