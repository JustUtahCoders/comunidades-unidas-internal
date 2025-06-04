const mariadb = require("mariadb/callback.js");
const _ = require("lodash");
const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound,
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
  nullableValidZip,
  nullableValidEnum,
} = require("../utils/validation-utils");
const { atLeastOne } = require("../utils/patch-utils");
const { getLeadById } = require("./get-lead.api");

app.patch("/api/leads/:id", (req, res, next) => {
  const paramValidationErrors = checkValid(req.params, validId("id"));

  const bodyValidationErrors = checkValid(
    req.body,
    nullableValidDate("dateOfSignUp"),
    nullableValidEnum(
      "leadStatus",
      "active",
      "inactive",
      "contacted",
      "inProgress",
      "convertedToClient"
    ),
    nullableValidDate("firstContactStatus"),
    nullableValidDate("secondContactStatus"),
    nullableValidDate("thirdContactStatus"),
    nullableValidEnum(
      "inactivityReason",
      "doNotCallRequest",
      "threeAttemptsNoResponse",
      "wrongNumber",
      "noLongerInterested",
      "relocated"
    ),
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

    const leadContactInfoChanged = atLeastOne(
      req.body,
      "phone",
      "smsConsent",
      "zip"
    );

    if (leadContactInfoChanged) {
      const leadContactInfoQuery =
        "UPDATE leads SET phone = ?, smsConsent = ?, zip = ?, modifiedBy = ? WHERE id = ?;";
      queries.push(leadContactInfoQuery);
      queryData.push(
        fullLead.phone,
        fullLead.smsConsent,
        fullLead.zip,
        userId,
        leadId
      );
    }

    const leadContactStatusChanged = atLeastOne(
      req.body,
      "dateOfSignUp",
      "leadStatus",
      "inactivityReason",
      "first",
      "second",
      "third"
    );

    if (leadContactStatusChanged) {
      let newInactivityReason = fullLead.inactivityReason;

      if (
        fullLead.leadStatus === "active" ||
        fullLead.leadStatus === "contacted" ||
        fullLead === "inProgress"
      ) {
        newInactivityReason = null;
      }

      const leadContactStatusInfo =
        "UPDATE leads SET dateOfSignUp = ?, leadStatus = ?, inactivityReason = ?, firstContactAttempt = ?, secondContactAttempt = ?, thirdContactAttempt = ?, modifiedBy = ? WHERE id = ?";
      queries.push(leadContactStatusInfo);
      queryData.push(
        fullLead.dateOfSignUp,
        fullLead.leadStatus,
        newInactivityReason,
        fullLead.contactStage.first
          ? new Date(fullLead.contactStage.first)
          : null,
        fullLead.contactStage.second
          ? new Date(fullLead.contactStage.second)
          : null,
        fullLead.contactStage.third
          ? new Date(fullLead.contactStage.third)
          : null,
        userId,
        leadId
      );
    }

    const leadServicesChanged = atLeastOne(req.body, "leadServices");

    if (leadServicesChanged) {
      queries.push("UPDATE leads SET modifiedBy = ? WHERE id = ?;");
      queryData.push(userId, leadId);

      const oldLeadServiceIds = oldLead.leadServices.map((service) => {
        return service.id;
      });

      const newLeadServiceIds = _.difference(
        fullLead.leadServices,
        oldLeadServiceIds
      );

      if (newLeadServiceIds.length > 0) {
        for (let i = 0; i < newLeadServiceIds.length; i++) {
          const serviceId = newLeadServiceIds[i];
          queries.push(
            "INSERT INTO leadServices (leadId, serviceId) VALUES (?, ?);"
          );
          queryData.push(leadId, serviceId);
        }
      }

      const removeLeadServiceIds = _.difference(
        oldLeadServiceIds,
        fullLead.leadServices
      );

      if (removeLeadServiceIds.length > 0) {
        for (let i = 0; i < removeLeadServiceIds.length; i++) {
          const serviceId = removeLeadServiceIds[i];
          queries.push(
            "DELETE FROM leadServices WHERE leadId = ? AND serviceId = ?;"
          );
          queryData.push(leadId, serviceId);
        }
      }
    }

    if (oldLead.eventSources.length < fullLead.eventSources.length) {
      const oldLeadEventIds = oldLead.eventSources.map(
        (event) => event.eventId
      );

      const newLeadEventIds = _.difference(
        fullLead.eventSources,
        oldLeadEventIds
      );

      for (let i = 0; i < newLeadEventIds.length; i++) {
        const eventId = newLeadEventIds[i];
        queries.push("INSERT INTO leadEvents (leadId, eventId) VALUES (?, ?);");
        queryData.push(leadId, eventId);
      }
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

    const mySqlQuery = mariadb.format(queryString, queryData);

    pool.query(mySqlQuery, (patchErr, result) => {
      if (patchErr) {
        return databaseError(req, res, patchErr);
      }

      getLeadById(req.params.id, (selectErr, lead) => {
        if (selectErr) {
          return databaseError(req, res, selectErr, connection);
        }

        res.send({
          lead,
        });
      });
    });
  });
});
