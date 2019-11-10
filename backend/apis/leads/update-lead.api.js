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
const {
  insertLeadServicesQuery,
  insertLeadEventsQuery
} = require("./insert-lead.utils");

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

  getLeadById(req.params.id, (selectErr, oldLead) => {
    if (selectErr) {
      return databaseError(req, res, err);
    }

    if (!oldLead) {
      return notFound(res, `Lead ${leadId} does not exist`);
    }

    const fullLead = Object.assign({}, oldLead, req.body);

    const queries = [];

    const leadBasicInfoChanged = atLeastOne(
      req.body,
      "firstName",
      "lastName",
      "age",
      "gender"
    );

    const leadContactInfoChanged = atLeastOne(
      req.body,
      "phone",
      "smsConsent",
      "zip"
    );

    const leadStatusChanged = atLeastOne(
      req.body,
      "dateOfSignUp",
      "leadStatus",
      "inactivityReason",
      "firstContactAttempt",
      "secondContactAttempt",
      "thirdContactAttempt"
    );

    const leadEventsChanged = atLeastOne(req.body, "eventSources");

    const leadServicesChanged = atLeastOne(req.body, "leadServices");

    if (leadBasicInfoChanged) {
      queries.push(
        mysql.format(
          `
            UPDATE leads
            SET
              firstName = ?,
              lastName = ?,
              age = ?,
              gender = ?,
              modifiedBy = ?
            WHERE id = ?;
          `,
          [
            fullLead.firstName,
            fullLead.lastName,
            fullLead.age,
            fullLead.gender,
            userId,
            leadId
          ]
        )
      );
    }

    if (leadContactInfoChanged) {
      queries.push(
        mysql.format(
          `
            UPDATE leads
            SET
              phone = ?,
              smsConsent = ?.
              zip = ?,
              modifiedBy = ?
            WHERE id = ?;
          `,
          [fullLead.phone, fullLead.smsConsent, fullLead.zip, userId, leadId]
        )
      );
    }

    if (leadStatusChanged) {
      queries.push(
        mysql.format(
          `
            UPDATE leads
            SET
              dateOfSignUp = ?,
              leadStatus = ?,
              inactivityAttempt = ?,
              firstContactAttempt = ?,
              secondContactAttempt = ?,
              thirdContactAttempt = ?,
              modifiedBy = ?
            WHERE id = ?;
          `,
          [
            fullLead.dateOfSignUp,
            fullLead.leadStatus,
            fullLead.inactivityReason,
            fullLead.firstContactAttempt,
            fullLead.secondContactAttempt,
            fullLead.thirdContactAttempt,
            userId,
            leadId
          ]
        )
      );
    }

    if (leadEventsChanged) {
      queries.push(
        insertLeadEventsQuery(
          leadId,
          userId,
          fullLead.eventSources,
          oldLead.eventSources
        )
      );
    }

    if (leadServicesChanged) {
      queries.push(
        insertLeadServicesQuery(
          leadId,
          userId,
          fullLead.leadServices,
          oldLead.leadServices
        )
      );
    }

    if (queries.length === 0) {
      res.send({
        lead: oldLead
      });

      return;
    }

    pool.query(queries.join("\n"), (patchErr, result) => {
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
