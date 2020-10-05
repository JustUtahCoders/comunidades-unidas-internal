const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound,
} = require("../../server");
const mysql = require("mysql");
const { formatResponseInvoice } = require("./invoice-utils");
const {
  checkValid,
  validId,
  nullableValidTags,
} = require("../utils/validation-utils");
const fs = require("fs");
const path = require("path");
const { validTagsList, sanitizeTags } = require("../tags/tag.utils");

const getInvoiceSqlStr = fs.readFileSync(
  path.resolve(__dirname, "./get-invoice.sql")
);

app.get("/api/invoices/:invoiceId", (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.params, validId("invoiceId")),
    ...checkValid(req.query, nullableValidTags("tags", user.permissions)),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const tags = sanitizeTags(req.query.tags);
  const redactedTags = validTagsList.filter((t) => !tags.includes(t));

  getFullInvoiceById(
    { id: req.params.invoiceId, user, redactedTags },
    (err, invoice) => {
      if (err) {
        return databaseError(req, res, err);
      }

      if (invoice === 404) {
        return notFound(
          res,
          `No such invoice with id '${req.params.invoiceId}'`
        );
      }

      res.send(invoice);
    }
  );
});

exports.getFullInvoiceById = getFullInvoiceById;

function getFullInvoiceById({ id, redactedTags }, errBack) {
  if (!id) {
    return errBack(Error(`invoice id must be provided`), null);
  }

  const getInvoiceSql = mysql.format(getInvoiceSqlStr, [id, id, id, id, id]);

  pool.query(getInvoiceSql, (err, result) => {
    if (err) {
      return errBack(err, null);
    }

    const [
      invoiceResult,
      invoiceLineItems,
      invoiceClients,
      invoicePayments,
      invoiceTags,
    ] = result;
    const invoice = invoiceResult[0];

    if (!invoice) {
      return errBack(null, 404);
    }

    errBack(
      null,
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
        invoicePayments,
        invoiceClients,
        invoiceLineItems,
        invoiceTags: invoiceTags.map((t) => t.tag).filter(Boolean),
        redactedTags,
      })
    );
  });
}
