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
const { checkValid, nonEmptyString } = require("../utils/validation-utils");

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

  // We always want to only select clients who want text messages
  req.query.wantsSMS = true;

  const mysqlStr = clientListQuery(req.query);

  pool.query(mysqlStr, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [clientRows] = result;

    const clientsWithPhone = clientRows
      .map(row => ({
        clientId: row.id,
        primaryPhone: row.primaryPhone
      }))
      .filter(c => Boolean(c.primaryPhone));

    const phoneNumbers = Array.from(
      new Set(clientsWithPhone.map(c => c.primaryPhone))
    );

    const response = {
      clientsMatched: clientRows.length,
      clientsWithPhone: clientsWithPhone.length,
      uniquePhoneNumbers: phoneNumbers.length
    };

    if (phoneNumbers.length === 0) {
      return res.send(response);
    }

    const notificationOpts = {
      toBinding: phoneNumbers.map(address =>
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
        res.send(response);
      })
      .catch(err => {
        internalError(req, res, err);
      });
  });
});
