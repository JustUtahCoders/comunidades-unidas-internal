const mysql = require("mysql2");
const {
  app,
  databaseError,
  pool,
  insufficientPrivileges,
} = require("../../server");
const { groupBy } = require("lodash");
const path = require("path");
const fs = require("fs");
const { checkUserRole } = require("../utils/auth-utils");

const sql = fs.readFileSync(
  path.resolve(__dirname, "./get-client-intake-questions.sql"),
  "utf-8"
);

app.get("/api/client-intake-questions", (req, res, next) => {
  pool.query(mysql.format(sql, []), (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const rows = result.map((q) => ({
      id: q.id,
      section: q.section,
      type: q.type,
      dataKey: q.dataKey,
      label: q.label,
      placeholder: q.placeholder,
      required: Boolean(q.required),
      disabled: Boolean(q.disabled),
      sectionOrder: q.sectionOrder,
    }));

    const sections = groupBy(rows, "section");

    Object.keys(sections).forEach((section) => {
      sections[section].sort(
        (first, second) => first.sectionOrder - second.sectionOrder
      );
    });

    res.send({
      sections,
    });
  });
});
