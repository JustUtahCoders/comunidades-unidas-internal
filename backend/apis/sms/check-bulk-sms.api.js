const { app, invalidRequest, pool, databaseError } = require("../../server");
const {
  validateClientListQuery,
  clientListQuery,
} = require("../clients/list-clients.api");
const {
  validateListLeadsQuery,
  listLeadsQuery,
} = require("../leads/list-leads.api");

app.post(`/api/check-bulk-texts`, (req, res) => {
  const clientValidationErrors = validateClientListQuery(req.query);
  const leadValidationErrors = validateListLeadsQuery(req.query);

  const validationErrors = [
    ...clientValidationErrors,
    ...leadValidationErrors,
    ...validateClientListQuery(req.query),
    ...validateListLeadsQuery(req.query),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  // Pagination doesn't apply to sending a bulk text
  delete req.query.page;

  const includeClients = req.query.personType !== "lead";
  const includeLeads = req.query.personType !== "client";

  const clientQuery =
    clientValidationErrors.extraKeys.length > 0 || !includeClients
      ? "SELECT * FROM clients WHERE false; SELECT 0;"
      : clientListQuery(req.query);
  const leadsQuery =
    leadValidationErrors.extraKeys.length > 0 || !includeLeads
      ? "SELECT * FROM leads WHERE false; SELECT 0;"
      : listLeadsQuery(req.query);
  const finalQuery = clientQuery + leadsQuery;

  console.log(
    includeClients,
    includeLeads,
    clientValidationErrors.extraKeys,
    leadValidationErrors.extraKeys
  );

  pool.query(finalQuery, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [clientRows, totalCountClientRows, leadRows] = result;

    const response = filterResultForBulkText(clientRows, leadRows);

    delete response.data;

    res.send(response);
  });
});

function filterResultForBulkText(clientRows, leadRows) {
  const clientsWithPhones = clientRows.filter((r) => r.primaryPhone);
  const leadsWithPhones = leadRows.filter((r) => r.phone);

  const clientRecipients = clientsWithPhones.filter((c) => c.textMessages);
  const leadRecipients = leadsWithPhones.filter((l) => l.smsConsent);

  const phoneNumbers = Array.from(
    new Set(
      clientRecipients
        .map((r) => r.primaryPhone)
        .concat(leadRecipients.map((r) => r.phone))
    )
  );

  return {
    searchMatch: {
      clients: clientRows.length,
      leads: leadRows.length,
    },
    withPhone: {
      clients: clientsWithPhones.length,
      leads: leadsWithPhones.length,
    },
    recipients: {
      clients: clientRecipients.length,
      leads: leadRecipients.length,
      uniquePhoneNumbers: phoneNumbers.length,
    },
    data: {
      clientsWithPhones,
      leadsWithPhones,
      clientRecipients,
      leadRecipients,
      phoneNumbers,
    },
  };
}

exports.filterResultForBulkText = filterResultForBulkText;
