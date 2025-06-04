const { pool, app, invalidRequest, databaseError } = require("../../server");
const mariadb = require("mariadb");
const { checkValid, nonEmptyString } = require("../utils/validation-utils");
const fs = require("fs");
const path = require("path");
const { getMaterial } = require("./get-event-material.api");

const insertSql = fs.readFileSync(
  path.resolve(__dirname, "./create-event-material.sql"),
  "utf-8"
);

app.post("/api/materials", (req, res) => {
  const validationErrors = checkValid(req.body, nonEmptyString("name"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const sql = mariadb.format(insertSql, [req.body.name]);

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    getMaterial(result.insertId, (err, material) => {
      if (err === 404) {
        return databaseError(
          req,
          res,
          `Could not retrieve material after creating it`
        );
      }

      if (err) {
        return databaseError(req, res, err);
      }

      res.send(material);
    });
  });
});
