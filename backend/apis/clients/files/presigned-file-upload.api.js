const { app, internalError, invalidRequest } = require("../../../server");
const AWS = require("aws-sdk");
const dayjs = require("dayjs");
const { v4: uuidv4 } = require("uuid");
const { Bucket } = require("./file-helpers");
const { checkValid, nonEmptyString } = require("../../utils/validation-utils");

app.get("/api/file-upload-urls", (req, res, next) => {
  const validationErrors = checkValid(req.query, nonEmptyString("file"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  AWS.config.getCredentials((err, data) => {
    if (err) {
      return internalError(req, res, err);
    }

    const s3 = new AWS.S3();

    const [name, extension] = req.query.file.split(".");

    s3.createPresignedPost(
      {
        Bucket,
        Fields: {
          key: `${dayjs().format("YYYY-MM")}/${name}-${uuidv4()}.${extension}`,
        },
      },
      (err, presignedPost) => {
        if (err) {
          return internalError(req, res, err);
        }

        res.status(200).send({
          presignedPost: Object.assign({}, presignedPost, {
            url: `https://${Bucket}.s3.amazonaws.com`,
          }),
        });

        res.end();
      }
    );
  });
});
