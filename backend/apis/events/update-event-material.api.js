const {
  pool,
  app,
  invalidRequest,
  databaseError,
  notFound,
} = require("../../server");
const mariadb = require("mariadb/callback.js");
const {
  checkValid,
  nonEmptyString,
  validId,
} = require("../utils/validation-utils");
const fs = require("fs");
const path = require("path");
const { getMaterial } = require("./get-event-material.api");

const updateSql = fs.readFileSync(
  path.resolve(__dirname, "./update-event-material.sql"),
  "utf-8"
);

app.patch("/api/materials/:materialId", (req, res) => {
  const validationErrors = [
    ...checkValid(req.body, nonEmptyString("name")),
    ...checkValid(req.params, validId("materialId")),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const materialId = req.params.materialId;

  getMaterial(materialId, (err, material) => {
    if (err === 404) {
      return notFound(res, `No such material with id ${materialId}`);
    }

    if (err) {
      return databaseError(req, res, err);
    }

    const sql = mariadb.format(updateSql, [req.body.name, materialId]);

    pool.query(sql, (err, result) => {
      if (err) {
        return databaseError(req, res, err);
      }

      getMaterial(materialId, (err, result) => {
        if (err === 404) {
          return databaseError(
            req,
            res,
            `Could not retrieve material after updating it`
          );
        }

        if (err) {
          return databaseError(req, res, err);
        }

        res.send(result);
      });
    });
  });
});
