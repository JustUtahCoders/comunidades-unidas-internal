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
const { runQueriesArray } = require("../utils/mariadb-utils");

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

  const queries = [];

  queries.push(
    mariadb.format(`
    CREATE TEMPORARY TABLE newLeadIds (id INT);
  `)
  );

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];

    queries.push(
      mariadb.format(
        `INSERT INTO leads (dateOfSignUp, firstName, lastName, phone, smsConsent, zip, age, gender, addedBy, modifiedBy, firstContactAttempt, secondContactAttempt, thirdContactAttempt, leadStatus)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, null, null, null, 'active');
    `,
        [
          lead.dateOfSignUp || new Date(),
          lead.firstName,
          lead.lastName,
          lead.phone,
          lead.smsConsent,
          lead.zip,
          lead.age,
          lead.gender,
          user.id,
          user.id,
        ]
      )
    );

    queries.push(
      mariadb.format(`
      SET @leadId = LAST_INSERT_ID();
      INSERT INTO newLeadIds (id) VALUES(@leadId);
    `)
    );

    const leadServices = lead.leadServices;
    let leadServicesQuery = "";
    let leadReferralsQuery = "";

    for (let j = 0; j < leadServices.length; j++) {
      const serviceId = leadServices[j];
      queries.push(
        mariadb.format(
          `
        INSERT INTO leadServices (leadId, serviceId) VALUES (@leadId, ?)
      `,
          [serviceId]
        )
      );
    }

    const referrals = lead.referrals || [];
    for (let i = 0; i < referrals.length; i++) {
      queries.push(
        mariadb.format(
          `
        INSERT INTO leadReferrals
        (leadId, partnerServiceId, referralDate, addedBy)
        VALUES
        (@leadId, ?, ?, ?)
      `,
          [referrals[i].partnerServiceId, referrals[i].referralDate, user.id]
        )
      );
    }

    const leadEvents = lead.eventSources || [];
    for (let i = 0; i < leadEvents.length; i++) {
      queries.push(
        mariadb.format(
          "INSERT INTO leadEvents (leadId, eventId) VALUES (@leadId, ?)",
          [leadEvents[i]]
        )
      );
    }
  }

  queries.push(`
    SELECT * FROM newLeadIds;

    DROP TEMPORARY TABLE newLeadIds;
  `);

  runQueriesArray(queries, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    res.status(204).end();
  });
});
