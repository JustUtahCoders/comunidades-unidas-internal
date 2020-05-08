const { app, internalError } = require("../../../server");
const AWS = require("aws-sdk");
const dayjs = require("dayjs");
const { v4: uuidv4 } = require("uuid");

const Bucket =
  process.env.FILE_UPLOAD_BUCKET_NAME || "comunidades-unidas-test-file-uploads";

AWS.config.update({
  region: "us-west-1",
  accessKeyId: "AKIAWXUQ3BDWIPXUXWG3",
  secretAccessKey: "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",
});

app.get("/api/file-upload-urls", (req, res, next) => {
  console.log("here", 0);
  AWS.config.getCredentials((err, data) => {
    if (err) {
      console.log(err);
      return internalError(req, res, err);
    }

    console.log("here", 1);

    if (AWS.config.region !== "us-west-1") {
      throw Error("wrong region " + AWS.config.region);
    }

    console.log("here", 2);

    const s3 = new AWS.S3();

    const [name, extension] = req.query.file.split(".");

    const presignedPost = s3.createPresignedPost({
      Bucket,
      Fields: {
        key: `${dayjs().format("YYYY-MM")}/${name}-${uuidv4()}.${extension}`,
      },
    });

    res.status(200).send({
      presignedPost,
    });

    res.end();
  });
});
