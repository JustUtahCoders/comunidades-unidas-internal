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

    const leadChanged = atLeastOne(
      req.body,
      "dateOfSignUp",
      "firstName",
      "lastName",
      "phone",
      "smsConsent",
      "zip",
      "age",
      "gender",
      "modifiedBy"
    );

    if (leadChanged) {
      queries.push(
        mysql.format(
          `
						UPDATE leads
						SET
							dateOfSignUp = ?,
							firstName = ?,
							lastName = ?,
							phone = ?,
							smsConsent = ?,
							zip = ?,
							age = ?,
							gender = ?,
							modifiedBy = ?
						WHERE id = ?;
					`,
          [
            fullLead.dateOfSignUp,
            fullLead.firstName,
            fullLead.lastName,
            fullLead.phone,
            fullLead.smsConsent,
            fullLead.zip,
            fullLead.age,
            fullLead.gender,
            userId
          ]
        )
      );
    }

    const leadEventsChanged = atLeastOne(req.body, "eventSources");

    const leadServicesChanged = atLeastOne(req.body, "leadServices");

    if (leadEventsChanged || leadServicesChanged) {
      queries.push(`SET @leadDataId = LAST_INSERT_ID();`);
    }

    if (leadEventsChanged) {
      queries.push(insertLeadEventsQuery(leadId, fullLead.eventSources));
    }

    if (leadServicesChanged) {
      queries.push(
        insertLeadServicesQuery(
          leadId,
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

    console.log(queries);

    // pool.query(queries.join("\n"), (patchErr, result) => {
    // 	if (patchErr) {
    // 		return databaseError(req, res, patchErr)
    // 	}

    // 	getLeadById(req.params.id, (selectErr, lead) => {
    // 		if (selectErr) {
    // 			return databaseError(req, res, selectErr, connection)
    // 		}

    // 		res.send({
    // 			lead
    // 		})
    // 	})
    // })
  });
});
