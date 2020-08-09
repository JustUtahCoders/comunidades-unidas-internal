const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");
const { formatResponseInvoice } = require("./invoice-utils");
const { checkValid, validId } = require("../utils/validation-utils");
const path = require("path");
const fs = require("fs");
const rawGetSql = fs.readFileSync(
  path.join(__dirname, "get-client-invoices.sql"),
  "utf-8"
);

app.get("/api/clients/:clientId/invoices", (req, res) => {
  const clientId = req.params.clientId;

  const validationErrors = checkValid(req.params, validId("clientId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const getSql = mysql.format(rawGetSql, [clientId]);

  pool.query(getSql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    console.log(result);
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
          invoiceLineItems: JSON.parse(invoice.lineItems),
          invoicePayments: JSON.parse(invoice.payments),
        })
      ),
    });
  });
});
