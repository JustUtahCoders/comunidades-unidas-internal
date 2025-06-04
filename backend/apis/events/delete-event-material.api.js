const {
  pool,
  app,
  invalidRequest,
  databaseError,
  notFound,
} = require("../../server");
const mariadb = require("mariadb");
const {
  checkValid,
  nonEmptyString,
  validId,
} = require("../utils/validation-utils");
const fs = require("fs");
const path = require("path");
const { getMaterial } = require("./get-event-material.api");

const deleteSql = fs.readFileSync(
  path.resolve(__dirname, "./delete-event-material.sql"),
  "utf-8"
);

app.delete("/api/materials/:materialId", (req, res) => {
  const validationErrors = checkValid(req.params, validId("materialId"));

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

    const sql = mariadb.format(deleteSql, [materialId]);

    pool.query(sql, (err, result) => {
      if (err) {
        return databaseError(req, res, err);
      }

      res.status(204).end();
    });
  });
});
