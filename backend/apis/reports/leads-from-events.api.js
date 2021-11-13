const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid, nullableValidDate } = require("../utils/validation-utils");
const mysql = require("mysql");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");

const sql = fs.readFileSync(
  path.resolve(__dirname, "./leads-from-events.sql"),
  "utf-8"
);
const defaultStart = "1000-01-01";
const defaultEnd = "3000-01-01";

app.get(`/api/reports/leads-from-events`, (req, res) => {
  const validationErrors = checkValid(
    req.query,
    nullableValidDate("start"),
    nullableValidDate("end")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const startDate = req.query.start || defaultStart;
  const endDate = req.query.end || defaultEnd;

  const formattedSql = mysql.format(sql, [startDate, endDate]);

  pool.query(formattedSql, (err, results) => {
    if (err) {
      return databaseError(err, res, err);
    }

    res.send(results);
  });
});
