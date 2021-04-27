const { app, invalidRequest, pool, databaseError } = require("../../server");
const {
  checkValid,
  nullableValidDate,
  nullableValidId,
} = require("../utils/validation-utils");
const mysql = require("mysql");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const { sumBy, sum, round } = require("lodash");
const dayjs = require("dayjs");
dayjs.extend(require("dayjs/plugin/weekOfYear"));
dayjs.extend(require("dayjs/plugin/quarterOfYear"));
dayjs.extend(require("dayjs/plugin/isToday"));
dayjs.extend(require("dayjs/plugin/isYesterday"));

const sql = fs.readFileSync(
  path.resolve(__dirname, "./custom-interaction-questions-report.sql"),
  "utf-8"
);
const defaultStart = "1000-01-01";
const defaultEnd = "3000-01-01";

app.get("/api/reports/custom-interaction-questions", (req, res) => {
  const validationErrors = checkValid(
    req.query,
    nullableValidDate("start"),
    nullableValidDate("end"),
    nullableValidId("questionId")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const startDate = req.query.start || defaultStart;
  const endDate = req.query.end || defaultEnd;

  const formattedSql = mysql.format(sql, [
    req.query.questionId,
    req.query.questionId,
    req.query.questionId,
    startDate,
    endDate,
  ]);
  console.log("FormattedSQL****", formattedSql);

  pool.query(formattedSql, (err, results) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [questionResults, questionOptionResults, answerResults] = results;

    if (questionResults.length === 0) {
      return invalidRequest(`No such question ${req.query.questionId}`);
    }

    const questionResult = questionResults[0];

    let summaryColumns;
    let summaryRows;

    answerResults.forEach((a) => {
      a.answer = JSON.parse(a.answer);
    });

    const rawAnswers = answerResults.map((a) => a.answer);

    const now = dayjs();

    switch (questionResult.type) {
      case "number":
        summaryColumns = ["Metric", "Value"];
        summaryRows = [
          ["# of Answers", rawAnswers.length.toLocaleString()],
          ["Average", humanAverage(rawAnswers)],
          ["Median", median(rawAnswers)],
        ];
        break;
      case "date":
        summaryColumns = ["Date", "Count"];
        summaryRows = [
          dateRow("Today", (d) => d.isToday()),
          dateRow("Yesterday", (d) => d.isYesterday()),
          dateRow(
            "This Week",
            (d) => now.week() === d.week() && d.year() === now.year()
          ),
          dateRow("Last Week", (d) => {
            if (now.week() === 1) {
              // first week of january, so we check last week of december
              return d.year() === now.year() - 1 && d.week() === 52;
            } else {
              return d.year() === now.year() && d.week() === now.week();
            }
          }),
          dateRow(
            "This Month",
            (d) => now.month() === d.month() && d.year() === now.year()
          ),
          dateRow("Last Month", (d) => {
            if (now.month() === 0) {
              // We're in january, so check for december
              return d.year() === now.year() - 1 && d.month() === 11;
            } else {
              return d.year() === now.year() && d.month() === now.month() - 1;
            }
          }),
          dateRow(
            "This Quarter",
            (d) => now.year() === d.year() && now.quarter() === d.quarter()
          ),
          dateRow("Last Quarter", (d) => {
            if (now.quarter() === 1) {
              // First quarter, so check last quarter of last year
              return d.year() === now.year() - 1 && d.quarter() === 4;
            } else {
              return (
                d.year() === now.year() && d.quarter() === now.quarter() - 1
              );
            }
          }),
          dateRow("This Year", (d) => d.year() === now.year()),
          dateRow("Last Year", (d) => d.year() === now.year() - 1),
        ];
        break;
      case "select":
        summaryColumns = ["Option", "Count"];
        summaryRows = questionOptionResults.map((o) => [
          o.name,
          rawAnswers.filter((a) => a === o.value).length,
        ]);
        break;
      case "boolean":
        summaryColumns = ["Answer", "Count"];
        summaryRows = [
          ["Yes", rawAnswers.filter((a) => a === true).length],
          ["No", rawAnswers.filter((a) => a !== true).length],
        ];
        break;
      default:
        summaryColumns = [];
        summaryRows = [];
        break;
    }
    console.log("Answer results-----", answerResults);
    res.send({
      summary: {
        columns: summaryColumns,
        rows: summaryRows,
      },
      clientAnswers: answerResults,
      reportParameters: {
        serviceName: questionResult.serviceName,
        questionName: questionResult.label,
        questionType: questionResult.type,
        start: req.query.start,
        end: req.query.end,
      },
    });

    function dateRow(label, fn) {
      return [label, rawAnswers.map((a) => dayjs(a)).filter(fn).length];
    }
  });
});

function humanAverage(arr) {
  return round(sum(arr) / arr.length, 1);
}

function median(values) {
  if (values.length === 0) return 0;

  values.sort(function (a, b) {
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2) return values[half];

  return round((values[half - 1] + values[half]) / 2.0, 2);
}
