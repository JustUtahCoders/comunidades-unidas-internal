const mysql = require("mysql");
const { app, pool, invalidRequest, databaseError } = require("../../server");
const { checkUserRole } = require("../utils/auth-utils");
const {
  checkValid,
  nonEmptyString,
  validId,
  validEnum,
  nullableValidArray,
} = require("../utils/validation-utils");
const fs = require("fs");
const path = require("path");

const getSql = fs.readFileSync(path.resolve(__dirname, "./get-custom-service-question.sql"));

app.post("/api/custom-service-questions", (req, res, next) => {
  const authError = checkUserRole(req, "Administrator");

  if (authError) {
    return insufficientPrivileges(res, authError);
  }

  const validationErrors = checkValid(
    req.body,
    nonEmptyString("label"),
    validEnum("type","text", "number", "select", "boolean", "date"),
    validId("serviceId"),
    nullableValidArray("options", (index) => {
      return (options) => {
        const errs = checkValid(
          options[index],
          nonEmptyString("name"),
          nonEmptyString("value"),
        );
        return errs.length > 0 ? errs : null;
      };
    }),
  );
  if (req.body.type === "select") {
    if (!req.body.options) {
      validationErrors.push("Cannot create a select question without options")
    }
  } else {
    if (req.body.options) {
      validationErrors.push("Cannot provide options unless question type is select")
    }
  }

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const query = mysql.format(
            `
      INSERT INTO customServiceQuestions 
      ( serviceId, label, type ) 
      values(?,?,?);

      SET @serviceQuestionId := LAST_INSERT_ID();

      ${(req.body.options || [])
        .map((i) =>
          mysql.format(
            `
            INSERT INTO customServiceQuestionOptions
            (name, value, questionId)
            VALUES
            (?,?, @serviceQuestionId);
      `,
            [i.name, i.value]
          )
        )
      .join("\n")}
        `,
    [req.body.serviceId, req.body.label, req.body.type]
  )

  pool.query(query, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }
    const questionId = result[0].insertId;
    getServiceQuestion(
      { id: questionId },
      (err, serviceQuestion) => {
        if (err) {
          return databaseError(req, res, err);
        }
        res.send(serviceQuestion)
      }
    );
  });
});

function getServiceQuestion({ id, isDeleted = false }, errBack) {
  const query = mysql.format(getSql, [id, isDeleted, id]);
  pool.query(query, (err, result) => {
    const questionResult = result[0]
    const optionResult = result[1]

    if (err) {
      return errBack(err, null);
    } else if (questionResult.length === 0) {
      errBack(null, 404);
    } else {
      const serviceQuestion = questionResult[0];
      const finalQuestion = {
        id: serviceQuestion.id,
        label: serviceQuestion.label,
        type: serviceQuestion.type,
        serviceId: serviceQuestion.serviceId,
        options: optionResult.map(option => {
          return {
            id: option.id,
            name: option.name,
            value: option.value
          }
        })
      }
      if (finalQuestion.type !== "select") {
        delete finalQuestion.options
      }
      errBack(null,finalQuestion);
    }
  });
}

exports.getServiceQuestion = getServiceQuestion;
