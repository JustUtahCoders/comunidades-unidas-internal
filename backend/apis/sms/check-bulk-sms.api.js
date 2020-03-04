const { app, invalidRequest, pool, databaseError } = require("../../server");
const {
  validateClientListQuery,
  clientListQuery
} = require("../clients/list-clients.api");
const {
  validateListLeadsQuery,
  listLeadsQuery
} = require("../leads/list-leads.api");

app.post(`/api/check-bulk-texts`, (req, res) => {
  const validationErrors = [
    ...validateClientListQuery(req.query),
    ...validateListLeadsQuery(req.query)
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  // Pagination doesn't apply to sending a bulk text
  delete req.query.page;

  // We always want to only select clients who want text messages
  req.query.wantsSMS = true;

  const clientQuery = clientListQuery(req.query);
  const leadsQuery = listLeadsQuery(req.query);

  const finalQuery = clientQuery + leadsQuery;

  pool.query(finalQuery, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [clientRows, totalCountClientRows, leadRows] = result;

    console.log(clientRows, leadRows);

    const phoneNumbers = Array.from(
      new Set(
        clientRows.map(r => r.primaryPhone).concat(leadRows.map(r => r.phone))
      )
    );

    const response = {
      clientsMatched: clientRows.length,
      leadsMatched: leadRows.length,
      uniquePhoneNumbers: phoneNumbers.length
    };

    res.send(response);
  });
});
