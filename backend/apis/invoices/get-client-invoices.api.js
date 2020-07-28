const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");
const { formatResponseInvoice } = require("./invoice-utils");
const { checkValid, validId } = require("../utils/validation-utils");

app.get("/api/clients/:clientId/invoices", (req, res) => {
  const clientId = req.params.clientId;

  const validationErrors = checkValid(req.params, validId("clientId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const getSql = mysql.format(
    `
    SELECT
      invoices.id, invoices.invoiceNumber, invoices.invoiceDate, invoices.clientNote,
      invoices.totalCharged, invoices.status, invoices.dateAdded, invoices.addedBy,
      invoices.dateModified, invoices.modifiedBy, addedUser.id addedUserId,
      addedUser.firstName addedFirstName, addedUser.lastName addedLastName,
      modifiedUser.id modifiedUserId, modifiedUser.firstName modifiedUserFirstName,
      modifiedUser.lastName modifiedUserLastName

      FROM invoices
      JOIN invoiceClients ON invoiceClients.clientId = invoices.id
      JOIN users addedUser ON invoices.addedBy = addedUser.id
      JOIN users modifiedUser ON invoices.modifiedBy = modifiedUser.id
    WHERE
      invoiceClients.clientId = ?;
  `,
    [clientId]
  );

  pool.query(getSql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    res.send({
      invoices: result.map((invoice) =>
        formatResponseInvoice({
          invoice,
          createdByUser: {
            id: invoice.addedUserId,
            firstName: invoice.addedFirstName,
            lastName: invoice.addedLastName,
          },
          modifiedByUser: {
            id: invoice.modifiedUserId,
            firstName: invoice.modifiedUserFirstName,
            lastName: invoice.modifiedUserLastName,
          },
        })
      ),
    });
  });
});
