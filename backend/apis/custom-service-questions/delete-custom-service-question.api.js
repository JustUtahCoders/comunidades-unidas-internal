const {
  pool,
  app,
  invalidRequest,
  databaseError,
  notFound,
} = require("../../server");
const mysql = require("mysql");
const {
  checkValid,
  nonEmptyString,
  validId,
} = require("../utils/validation-utils");
const fs = require("fs");
const path = require("path");
const { getServiceQuestion } = require("./create-custom-service-question.api");

const deleteSql = fs.readFileSync(
  path.resolve(__dirname, "./delete-custom-service-question.sql"),
  "utf-8"
);

app.delete("/api/custom-service-questions/:questionId", (req, res) => {
  const validationErrors = checkValid(req.params, validId("questionId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const questionId = req.params.questionId;

  getServiceQuestion({ id: questionId, isDeleted: false }, (err, question) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (question === 404) {
      return notFound(res, `No question found with id ${questionId}`);
    }
    const sql = mysql.format(deleteSql, [questionId]);

    pool.query(sql, (err, result) => {
      if (err) {
        return databaseError(req, res, err);
      }

      res.status(204).end();
    });
  });
});
