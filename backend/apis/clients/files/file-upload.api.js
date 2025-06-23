const { app, invalidRequest, internalError } = require("../../../server.js");
const multiparty = require("multiparty");
const fs = require("fs");
const path = require("path");
const {
  checkValid,
  nonEmptyString,
  validArray,
} = require("../../utils/validation-utils.js");

app.post("/api/file-upload", (req, res) => {
  if (!process.env.FILE_STORAGE_PATH) {
    return internalError(req, res, "FILE_STORAGE_PATH not defined");
  }

  const form = new multiparty.Form();

  form.parse(req, (err, fields, files) => {
    const validationErrors = [
      ...checkValid(fields, nonEmptyString("key[0]")),
      ...checkValid(
        files,
        validArray("file", (index) => {
          return (files) => {
            const errs = checkValid(
              files[index],
              nonEmptyString("path"),
              nonEmptyString("originalFilename")
            );
            return errs.length > 0 ? errs : null;
          };
        })
      ),
    ];

    if (validationErrors.length > 0) {
      return invalidRequest(res, validationErrors);
    }

    fs.mkdirSync(process.env.FILE_STORAGE_PATH, { recursive: true });

    for (const file of files.file) {
      fs.copyFileSync(
        file.path,
        path.resolve(process.env.FILE_STORAGE_PATH, `./${fields.key}`)
      );
    }

    res.status(204).end();
  });
});
