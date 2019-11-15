const mysql = require("mysql");
const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound
} = require("../../server");
const {
  checkValid,
  validId,
  validInteger,
  nullableNonEmptyString,
  nullableValidDate,
  nullableValidArray,
  nullableValidBoolean,
  nullableValidInteger,
  nullableValidPhone,
  nullableValidZip
} = require("../utils/validation-utils");
const { atLeastOne } = require("../utils/patch-utils");
const { getLeadById } = require("./get-lead.api");

app.patch("/api/leads/:id", (req, res, next) => {
  const paramValidationErrors = checkValid(req.params, validId("id"));

  const bodyValidationErrors = checkValid(
    req.body,
    nullableValidDate("dateOfSignUp"),
    nullableNonEmptyString("firstName"),
    nullableNonEmptyString("lastName"),
    nullableValidPhone("phone"),
    nullableValidBoolean("smsConsent"),
    nullableValidZip("zip"),
    nullableValidInteger("age"),
    nullableNonEmptyString("gender"),
    nullableValidArray("leadServices", validInteger),
    nullableValidArray("eventSources", validInteger)
  );

  const validationErrors = [...paramValidationErrors, ...bodyValidationErrors];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const userId = req.session.passport.user.id;
  const leadId = Number(req.params.id);

  getLeadById(leadId, (selectErr, oldLead) => {
    if (selectErr) {
      return databaseError(req, res, err);
    }

    if (!oldLead) {
      return notFound(res, `Lead ${leadId} does not exist`);
    }

    const fullLead = Object.assign({}, oldLead, req.body);

    const queries = [];
    const queryData = [];

    const leadBasicInfoChanged = atLeastOne(
      req.body,
      "firstName",
      "lastName",
      "age",
      "gender"
    );

    if (leadBasicInfoChanged) {
      const leadBasicUpdateQuery =
        "UPDATE leads SET firstName = ?, lastName = ?, age = ?, gender = ?, modifiedBy = ? WHERE id = ?;";
      queries.push(leadBasicUpdateQuery);
      queryData.push(
        fullLead.firstName,
        fullLead.lastName,
        fullLead.age,
        fullLead.gender,
        userId,
        leadId
      );
    }

    if (queries.length === 0) {
      res.send(oldLead);
      return;
    }

    let queryString = "";

    if (queries.length === 1) {
      queryString = queries[0];
    }

    if (queries.length > 1) {
      queryString = queries.join(" ");
    }

    const mySqlQuery = mysql.format(queryString, queryData);

    pool.query(mySqlQuery, (patchErr, result) => {
      if (patchErr) {
        return databaseError(req, res, patchErr);
      }

      getLeadById(req.params.id, (selectErr, lead) => {
        if (selectErr) {
          return databaseError(req, res, selectErr, connection);
        }
        res.send({
          lead
        });
      });
    });
  });
});
