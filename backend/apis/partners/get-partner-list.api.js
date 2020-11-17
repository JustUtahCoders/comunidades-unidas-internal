const mysql = require("mysql");
const { app, pool, invalidRequest, databaseError } = require("../../server");
const {
  checkValid,
  nullableNonEmptyString,
} = require("../utils/validation-utils");
const fs = require("fs");
const path = require("path");

const sql = fs.readFileSync(
  path.resolve(__dirname, "./get-partner-list.sql"),
  "utf-8"
);

app.get("/api/partners", (req, res) => {
  const validationErrors = checkValid(
    req.query,
    nullableNonEmptyString("includeInactive")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const includeInactive = req.query.includeInactive === "true";
  const query = mysql.format(sql, [!includeInactive, !includeInactive]);

  pool.query(query, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    res.send(
      result.map((r) => {
        return {
          id: r.id,
          name: r.name,
          isActive: Boolean(r.isActive),
          phone: r.phone,
          services: JSON.parse(r.services)
            .filter((s) => s.id !== null)
            .map((s) => {
              return {
                id: s.id,
                name: s.name,
                isActive: Boolean(s.isActive),
                dateAdded: s.dateAdded,
                addedBy: s.addedBy,
                dateModified: s.dateModified,
                modifiedBy: s.modifiedBy,
              };
            }),
          dateAdded: r.dateAdded,
          addedBy: r.addedBy,
          dateModified: r.dateModified,
          modifiedBy: r.modifiedBy,
        };
      })
    );
  });
});
