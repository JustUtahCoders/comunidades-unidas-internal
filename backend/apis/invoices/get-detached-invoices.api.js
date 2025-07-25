const { app, databaseError, pool, invalidRequest } = require("../../server");
const mariadb = require("mariadb/callback.js");
const { formatResponseInvoice } = require("./invoice-utils");
const { checkValid, nullableValidTags } = require("../utils/validation-utils");
const { sanitizeTags, validTagsList } = require("../tags/tag.utils");
const ejs = require("ejs");
const path = require("path");

const rawGetSqlPromise = ejs.renderFile(
  path.resolve(__dirname, "./get-client-invoices.sql"),
  { detachedInvoices: true }
);

app.get("/api/detached-invoices", async (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.query, nullableValidTags("tags", user.permissions)),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const tags = sanitizeTags(req.query.tags);
  const redactedTags = validTagsList.filter((t) => !tags.includes(t));

  const rawGetSql = await rawGetSqlPromise;
  const getSql = mariadb.format(rawGetSql, []);

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
          invoiceClients: invoice.clients.filter((c) => c.clientId),
          invoiceTags: invoice.tags.map((t) => t.tag).filter(Boolean),
          redactedTags,
        })
      ),
    });
  });
});
