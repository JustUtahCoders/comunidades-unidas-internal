const { app, internalError } = require("../../../server");
const AWS = require("aws-sdk");
const dayjs = require("dayjs");
const { v4: uuidv4 } = require("uuid");

const Bucket =
  process.env.FILE_UPLOAD_BUCKET_NAME || "comunidades-unidas-test-file-uploads";

app.get("/api/file-upload-urls", (req, res, next) => {
  AWS.config.getCredentials((err) => {
    if (err) {
      return internalError(req, res, err);
    }

    const s3 = new AWS.S3();
    const [name, extension] = req.query.file.split(".");

    const url = s3.getSignedUrl("putObject", {
      Bucket,
      Key: `${dayjs().format("YYYY-MM")}/${name}-${uuidv4()}.${extension}`,
    });

    res.status(200).send({
      uploadUrl: url,
    });

    res.end();
  });
});
