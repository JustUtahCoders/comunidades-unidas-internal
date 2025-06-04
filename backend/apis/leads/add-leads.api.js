const mariadb = require("mariadb/callback.js");
const { app, databaseError, pool, invalidRequest } = require("../../server");
const {
  checkValid,
  nonEmptyString,
  validArray,
  validBoolean,
  nullableValidDate,
  validId,
  validDateTime,
  validInteger,
  nullableNonEmptyString,
  nullableValidInteger,
  nullableValidArray,
} = require("../utils/validation-utils");
const fs = require("fs");
const path = require("path");

const insertReferralSql = fs.readFileSync(
  path.resolve(__dirname, "./referrals/add-lead-referral.sql"),
  "utf-8"
);

app.post("/api/leads", (req, res) => {
  const leads = req.body;
  const user = req.session.passport.user;

  if (!Array.isArray(leads)) {
    return invalidRequest(
      res,
      `POST /api/leads must be called with an array of leads in the request body`
    );
  }

  for (let i = 0; i < leads.length; i++) {
    const validityErrors = checkValid(
      leads[i],
      nullableValidDate("dateOfSignUp"),
      nonEmptyString("firstName"),
      nonEmptyString("lastName"),
      nonEmptyString("phone"),
      validBoolean("smsConsent"),
      nullableNonEmptyString("zip"),
      nullableValidInteger("age"),
      nullableNonEmptyString("gender"),
      nullableValidArray("eventSources", validInteger),
      validArray("leadServices", validInteger),
      nullableValidArray("referrals", (index) => {
        return (invoices) => {
          const errs = checkValid(
            invoices[index],
            validId("partnerServiceId"),
            validDateTime("referralDate")
          );
          return errs.length > 0 ? errs : null;
        };
      })
    );

    if (validityErrors.length > 0) {
      return invalidRequest(res, validityErrors);
    }
  }

  let leadQuery = `
    CREATE TEMPORARY TABLE newLeadIds (id INT);
  `;
  const leadDataArray = [];

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];

    const addToLeadQuery = `INSERT INTO leads (dateOfSignUp, firstName, lastName, phone, smsConsent, zip, age, gender, addedBy, modifiedBy, firstContactAttempt, secondContactAttempt, thirdContactAttempt, leadStatus)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, null, null, null, 'active');
    `;
    const setLeadId = `
      SET @leadId = LAST_INSERT_ID();
      INSERT INTO newLeadIds (id) VALUES(@leadId);
    `;

    leadDataArray.push(
      lead.dateOfSignUp || new Date(),
      lead.firstName,
      lead.lastName,
      lead.phone,
      lead.smsConsent,
      lead.zip,
      lead.age,
      lead.gender,
      user.id,
      user.id
    );

    const leadServices = lead.leadServices;
    let leadServicesQuery = "";
    let leadReferralsQuery = "";

    if (leadServices.length > 0) {
      leadServicesQuery =
        "INSERT INTO leadServices (leadId, serviceId) VALUES (@leadId, ?)";

      leadDataArray.push(leadServices[0]);

      if (leadServices.length > 1) {
        for (let j = 1; j < leadServices.length; j++) {
          const serviceId = leadServices[j];
          leadServicesQuery = leadServicesQuery + ", (@leadId, ?)";
          leadDataArray.push(serviceId);
        }
      }

      leadServicesQuery += ";";
    }

    const referrals = lead.referrals || [];
    if (referrals.length > 0) {
      const leadId = {
        toSqlString() {
          return "@leadId";
        },
      };
      leadReferralsQuery += referrals
        .map((referral) =>
          mariadb.format(insertReferralSql, [
            leadId,
            referral.partnerServiceId,
            referral.referralDate,
            user.id,
          ])
        )
        .join("\n");
    }

    const leadEvents = lead.eventSources || [];
    let leadEventsQuery = "";

    if (leadEvents.length > 0) {
      leadEventsQuery =
        "INSERT INTO leadEvents (leadId, eventId) VALUES (@leadId, ?)";

      leadDataArray.push(leadEvents[0]);

      if (leadEvents.length > 1) {
        for (let j = 1; j < leadEvents.length; j++) {
          const eventId = leadEvents[j];
          leadEventsQuery = leadEventsQuery + ", (@leadId, ?)";
          leadDataArray.push(eventId);
        }
      }

      leadEventsQuery += ";";
    }

    const newLeadQuery =
      addToLeadQuery +
      setLeadId +
      leadServicesQuery +
      leadEventsQuery +
      leadReferralsQuery;

    leadQuery = `${leadQuery} ${newLeadQuery}`;
  }

  leadQuery += `
    SELECT * FROM newLeadIds;

    DROP TEMPORARY TABLE newLeadIds;
  `;

  let newLeadsData = mariadb.format(leadQuery, leadDataArray);

  pool.query(newLeadsData, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const newLeadIds = result[result.length - 2];

    res.json({
      message: `Created ${leads.length} leads.`,
      leadIds: newLeadIds.map((row) => row.id),
    });
  });
});
