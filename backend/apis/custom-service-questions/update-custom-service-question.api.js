const mysql = require("mysql2");
const {
  app,
  pool,
  invalidRequest,
  databaseError,
  notFound,
} = require("../../server");
const {
  checkValid,
  nonEmptyString,
  validId,
  validEnum,
  nullableValidArray,
} = require("../utils/validation-utils");
const fs = require("fs");
const path = require("path");
const { getServiceQuestion } = require("./create-custom-service-question.api");

const updateSql = fs.readFileSync(
  path.resolve(__dirname, "./update-custom-service-question.sql"),
  "utf-8"
);

const createOptionSql = fs.readFileSync(
  path.resolve(__dirname, "./create-custom-service-question-option.sql"),
  "utf-8"
);

const deleteOptionSql = fs.readFileSync(
  path.resolve(__dirname, "./delete-custom-service-question-options.sql"),
  "utf-8"
);

app.patch("/api/custom-service-questions/:questionId", (req, res, next) => {
  const questionId = req.params.questionId;

  const validationErrors = checkValid(
    req.body,
    nonEmptyString("label"),
    validEnum("type", "text", "number", "select", "boolean", "date"),
    validId("serviceId"),
    nullableValidArray("options", (index) => {
      return (options) => {
        const errs = checkValid(
          options[index],
          nonEmptyString("name"),
          nonEmptyString("value")
        );
        return errs.length > 0 ? errs : null;
      };
    })
  );
  if (req.body.type === "select") {
    if (
      req.body.hasOwnProperty("options") &&
      (req.body.options === null || req.body.options.length === 0)
    ) {
      validationErrors.push("Cannot update a question and give it no options");
    }
  } else {
    if (req.body.options) {
      validationErrors.push(
        "Cannot provide options unless question type is select"
      );
    }
  }

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  getServiceQuestion({ id: questionId, isDeleted: false }, (err, question) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (question === 404) {
      return notFound(res, `No question found with id ${questionId}`);
    }

    const finalQuestion = {
      ...question,
      label: req.body.hasOwnProperty("label") ? req.body.label : question.name,
      type: req.body.hasOwnProperty("type") ? req.body.type : question.type,
      serviceId: req.body.hasOwnProperty("serviceId")
        ? req.body.serviceId
        : question.serviceId,
    };

    const queries = [];

    const updateQuery = mysql.format(updateSql, [
      finalQuestion.label,
      finalQuestion.type,
      finalQuestion.serviceId,
      finalQuestion.id,
    ]);

    queries.push(updateQuery);
    if (req.body.type === "select") {
      const deleteQuery = mysql.format(deleteOptionSql, [questionId]);
      queries.push(deleteQuery);
      const createOptionQueries = req.body.options.map((option) =>
        mysql.format(createOptionSql, [option.name, option.value, questionId])
      );
      queries.push(...createOptionQueries);
      finalQuestion.options = req.body.options;
    }
    pool.query(queries.join("\n"), (err, result) => {
      if (err) {
        return databaseError(req, res, err);
      }
      res.send(finalQuestion);
    });
  });
});
