const { pool, app, databaseError } = require("../../server");
const mariadb = require("mariadb/callback.js");
const path = require("path");
const fs = require("fs");

const getSql = fs.readFileSync(
  path.resolve(__dirname, "./get-all-event-materials.sql"),
  "utf-8"
);

app.get("/api/materials", (req, res) => {
  const sql = mariadb.format(getSql, []);

  pool.query(sql, (err, rows) => {
    if (err) {
      return databaseError(req, res, err);
    }

    res.send(
      rows.map((row) => ({
        id: row.id,
        name: row.name,
      }))
    );
  });
});
