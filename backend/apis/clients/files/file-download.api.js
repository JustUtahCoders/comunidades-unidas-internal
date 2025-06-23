const {
  app,
  internalError,
  pool,
  invalidRequest,
  databaseError,
  notFound,
} = require("../../../server.js");
const mariadb = require("mariadb/callback.js");
const { checkValid, validId } = require("../../utils/validation-utils.js");
const fs = require("fs");
const path = require("path");
const mimeTypes = require("mime-types");

app.get("/api/file-download/:fileId", (req, res) => {
  if (!process.env.FILE_STORAGE_PATH) {
    return internalError(req, res, "FILE_STORAGE_PATH not defined");
  }

  const validationErrors = checkValid(req.params, validId("fileId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const query = mariadb.format(
    `
    SELECT * FROM clientFiles WHERE id = ? LIMIT 1;
  `,
    [req.params.fileId]
  );

  pool.query(query, (err, data) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (data.length === 0) {
      return notFound(res, `File not found`);
    }

    const file = fs.readFileSync(
      path.resolve(process.env.FILE_STORAGE_PATH, `./${data[0].s3Key}`)
    );

    if (req.query.contentDisposition) {
      res.setHeader("content-disposition", req.query.contentDisposition);
    }

    if (req.query.contentType) {
      res.setHeader("content-type", mimeTypes.lookup(req.query.contentType));
    }

    res.status(200).send(file).end();
  });
});
