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
const { filterResultForBulkText } = require("./check-bulk-sms.api");
const queryString = require("query-string");

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

app.post(`/api/bulk-texts`, (req, res) => {
  const validationErrors = [
    ...validateClientListQuery(req.query),
    ...validateListLeadsQuery(req.query),
    ...checkValid(req.body, nonEmptyString("smsBody"))
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

  const clientQuery = clientListQuery(req.query);
  const leadsQuery = listLeadsQuery(req.query);
  const finalQuery = clientQuery + leadsQuery;

  pool.query(finalQuery, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [clientRows, totalCountClientRows, leadRows] = result;

    const response = filterResultForBulkText(clientRows, leadRows);

    const data = response.data;
    delete response.data;

    if (data.phoneNumbers.length === 0) {
      return res.send(response);
    }

    const notificationOpts = {
      toBinding: data.phoneNumbers.map(address =>
        JSON.stringify({
          binding_type: "sms",
          address
        })
      ),
      body: req.body.smsBody
    };

    twilio.notify
      .services(process.env.TWILIO_SMS_SERVICE_SID)
      .notifications.create(notificationOpts)
      .then(notification => {
        const insertSql = insertBulkSmsQuery(
          response,
          data,
          notification.sid,
          req.session.passport.user.id,
          req.body.smsBody,
          req.query
        );

        pool.query(insertSql, (err, result) => {
          if (err) {
            return databaseError(req, res, err);
          }

          res.send(response);
        });
      })
      .catch(err => {
        internalError(req, res, err);
      });
  });
});

function insertBulkSmsQuery(totals, data, twilioSid, userId, smsBody, query) {
  const values = [
    twilioSid,
    smsBody,
    totals.searchMatch.clients,
    totals.withPhone.clients,
    totals.recipients.clients,
    totals.searchMatch.leads,
    totals.withPhone.leads,
    totals.recipients.leads,
    totals.recipients.uniquePhoneNumbers,
    queryString.stringify(query),
    userId
  ];

  data.clientRecipients.forEach(c => {
    values.push(c.primaryPhone, null, c.id);
  });

  data.leadRecipients.forEach(l => {
    values.push(l.phone, l.leadId, null);
  });

  return mysql.format(
    `
    INSERT INTO bulkSms
      (twilioSid, smsBody, clientsMatched, clientsWithPhone, clientRecipients, leadsMatched, leadsWithPhone, leadRecipients, uniquePhoneNumbers, query, addedBy)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

    SET @bulkSmsId := LAST_INSERT_ID();

    ${data.clientRecipients
      .map(
        c => `
      INSERT INTO bulkSmsRecipients
        (bulkSmsId, phone, leadId, clientId)
      VALUES
        (@bulkSmsId, ?, ?, ?);
    `
      )
      .join("\n")}

    ${data.leadRecipients
      .map(
        c => `
      INSERT INTO bulkSmsRecipients
        (bulkSmsId, phone, leadId, clientId)
      VALUES
        (@bulkSmsId, ?, ?, ?);
    `
      )
      .join("\n")}
  `,
    values
  );
}
