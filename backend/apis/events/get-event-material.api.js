const {
  pool,
  app,
  invalidRequest,
  notFound,
  databaseError,
} = require("../../server");
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
const getSql = fs.readFileSync(
  path.resolve(__dirname, "./get-event-material.sql")
);
const { checkValid, validId } = require("../utils/validation-utils");

app.get("/api/materials/:materialId", (req, res) => {
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

    res.send(material);
  });
});

exports.getMaterial = getMaterial;

function getMaterial(id, errBack) {
  const sql = mysql.format(getSql, [id]);

  pool.query(sql, (err, result) => {
    if (err) {
      return errBack(err);
    }

    if (result.length === 0) {
      return errBack(404);
    }

    errBack(null, {
      id: result[0].id,
      name: result[0].name,
    });
  });
}
