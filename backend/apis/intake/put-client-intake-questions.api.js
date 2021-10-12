const mysql = require("mysql");
const { app, databaseError, pool, invalidRequest } = require("../../server");
const {
  checkValid,
  validId,
  nonEmptyString,
  nullableNonEmptyString,
} = require("../utils/validation-utils");
const _ = require("lodash");
const { validBoolean } = require("../utils/validation-utils.js");

app.put("/api/client-intake-questions", (req, res) => {
  let validationErrors = [];
  if (!_.isPlainObject(req.body.sections)) {
    validationErrors.push(
      "HTTP request body json must have sections property that is an object"
    );
  }

  let numSections = 0;

  for (let section in req.body.sections) {
    numSections++;
    if (!Array.isArray(req.body.sections[section])) {
      validationErrors.push(`Section '${section}' is not a valid array`);
    } else {
      for (let question of req.body.sections[section]) {
        if (!_.isPlainObject(question)) {
          validationErrors.push(
            `Section '${section}' contains non-object items in its array`
          );
        } else {
          validationErrors.push(
            ...checkValid(
              question,
              validId("id"),
              nonEmptyString("label"),
              nullableNonEmptyString("placeholder"),
              validBoolean("required"),
              validBoolean("disabled")
            )
          );
        }
      }
    }
  }

  if (numSections === 0) {
    validationErrors.push("Must update at least one section");
  }

  if (validationErrors.length > 0) {
    return invalidRequest(req, validationErrors);
  }

  let sql = ``;
  for (let section in req.body.sections) {
    const questions = req.body.sections[section];
    questions.forEach((question, i) => {
      sql += mysql.format(
        `UPDATE clientIntakeQuestions set label = ?, placeholder = ?, required = ?, disabled = ?, sectionOrder = ? where id = ?;\n`,
        [
          question.label,
          question.placeholder,
          question.required,
          question.disabled,
          i,
          question.id,
        ]
      );
    });
  }

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    res.status(204).end();
  });
});
