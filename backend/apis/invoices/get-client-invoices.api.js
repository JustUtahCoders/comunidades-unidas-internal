const { app, databaseError, pool, invalidRequest } = require("../../server");
const mariadb = require("mariadb/callback.js");
const { formatResponseInvoice } = require("./invoice-utils");
const {
  checkValid,
  validId,
  nullableValidTags,
} = require("../utils/validation-utils");
const path = require("path");
const { sanitizeTags, validTagsList } = require("../tags/tag.utils");
const ejs = require("ejs");

const rawGetSqlPromise = ejs.renderFile(
  path.resolve(__dirname, "./get-client-invoices.sql"),
  { detachedInvoices: false }
);

app.get("/api/clients/:clientId/invoices", async (req, res) => {
  const clientId = req.params.clientId;
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.params, validId("clientId")),
    ...checkValid(req.query, nullableValidTags("tags", user.permissions)),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const tags = sanitizeTags(req.query.tags);
  const redactedTags = validTagsList.filter((t) => !tags.includes(t));

  const rawGetSql = await rawGetSqlPromise;
  const getSql = mariadb.format(rawGetSql, [clientId, clientId]);

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
          invoiceLineItems: invoice.lineItems,
          invoicePayments: invoice.payments,
          invoiceClients: invoice.clients,
          invoiceTags: invoice.tags.map((t) => t.tag).filter(Boolean),
          redactedTags,
        })
      ),
    });
  });
});
