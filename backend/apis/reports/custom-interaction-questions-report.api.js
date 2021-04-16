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

  const formattedSql = mysql.format(sql, [
    req.query.questionId,
    req.query.questionId,
  ]);

  pool.query(formattedSql, (err, results) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [questionResults, answerResults] = results;

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

    switch (questionResult.type) {
      case "number":
        summaryColumns = ["# of Answers", "Average", "Median"];
        summaryRows = [
          rawAnswers.length.toLocaleString(),
          humanAverage(rawAnswers),
          median(rawAnswers),
        ];
        break;
      default:
        summaryColumns = [];
        summaryRows = [];
        break;
    }

    res.send({
      summary: {
        columns: summaryColumns,
        rows: summaryRows,
      },
      clientAnswers: answerResults.map((r) => ({
        clientId: r.clientId,
        answer: JSON.parse(r.answer),
      })),
      reportParameters: {
        serviceName: questionResult.serviceName,
        questionName: questionResult.label,
        questionType: questionResult.type,
      },
    });
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

  return (values[half - 1] + values[half]) / 2.0;
}
