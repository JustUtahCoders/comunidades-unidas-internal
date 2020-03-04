const {
  app,
  invalidRequest,
  pool,
  databaseError,
  internalError
} = require("../../server");
const {
  validateClientListQuery,
  clientListQuery
} = require("../clients/list-clients.api");
const {
  validateListLeadsQuery,
  listLeadsQuery
} = require("../leads/list-leads.api");
const { checkValid, nonEmptyString } = require("../utils/validation-utils");
const mysql = require("mysql");

let twilio;
if (
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_SMS_SERVICE_SID
) {
  twilio = require("twilio")(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

app.post(`/api/check-bulk-texts`, (req, res) => {
  const validationErrors = [
    ...validateClientListQuery(req.query),
    ...validateListLeadsQuery(req.query)
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  if (!twilio) {
    return internalError(
      req,
      res,
      "TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables are not set"
    );
  }

  // Pagination doesn't apply to sending a bulk text
  delete req.query.page;

  // We always want to only select clients who want text messages
  req.query.smsConsent = true;

  const clientQuery = clientListQuery(req.query);
  const leadsQuery = listLeadsQuery(req.query);

  const finalQuery = clientQuery + leadsQuery;

  pool.query(finalQuery, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [clientRows, totalCountClientRows, leadRows] = result;

    const clientsWithPhone = clientRows
      .map(row => ({
        clientId: row.id,
        primaryPhone: row.primaryPhone
      }))
      .filter(c => Boolean(c.primaryPhone));

    const leadsWithPhone = leadRows.map(row => ({
      leadId: row.id,
      primaryPhone: row.phone
    }));

    const phoneNumbers = Array.from(
      new Set(
        clientsWithPhone.map(c => c.primaryPhone),
        leadsWithPhone.map(c => c.primaryPhone)
      )
    );

    const response = {
      clientsMatched: clientRows.length,
      clientsWithPhone: clientsWithPhone.length,
      leadsMatched: leadRows.length,
      leadsWithPhone: leadsWithPhone.length,
      uniquePhoneNumbers: phoneNumbers.length
    };

    res.send(response);
  });
});
