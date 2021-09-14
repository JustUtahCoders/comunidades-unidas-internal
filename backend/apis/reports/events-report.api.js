const { app, invalidRequest, pool, databaseError } = require("../../server");
const {
  checkValid,
  nullableValidDate,
  nullableNonEmptyString,
} = require("../utils/validation-utils");
const mysql = require("mysql");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");

const sql = fs.readFileSync(
  path.resolve(__dirname, "./events-report.sql"),
  "utf-8"
);
const defaultStart = "1000-01-01";
const defaultEnd = "3000-01-01";

app.get("/api/reports/events", (req, res) => {
  const validationErrors = checkValid(
    req.query,
    nullableValidDate("start"),
    nullableValidDate("end"),
    nullableNonEmptyString("eventName"),
    nullableNonEmptyString("eventLocation")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const startDate = req.query.start || defaultStart;
  const endDate = req.query.end || defaultEnd;
  const eventName = req.query.eventName || "";
  const eventLocation = req.query.eventLocation || "";

  const formattedSql = mysql.format(sql, [
    startDate,
    endDate,
    `%${eventName}${eventName.length > 0 ? "%" : ""}`,
    `%${eventLocation}${eventLocation.length > 0 ? "%" : ""}`,
  ]);

  pool.query(formattedSql, (err, results) => {
    if (err) {
      return databaseError(req, res, err);
    }

    res.send({
      numEvents: results[0].numEvents || 0,
      totalAttendance: results[0].totalAttendance || 0,
      materialsDistributed: results[0].materialsDistributed || 0,
      reportParameters: {
        start: startDate,
        end: endDate,
      },
    });
  });
});
