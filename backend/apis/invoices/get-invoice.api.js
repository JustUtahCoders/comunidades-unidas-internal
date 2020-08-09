const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound,
} = require("../../server");
const mysql = require("mysql");
const { formatResponseInvoice } = require("./invoice-utils");
const { checkValid, validId } = require("../utils/validation-utils");

app.get("/api/invoices/:invoiceId", (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = checkValid(req.params, validId("invoiceId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  getFullInvoiceById(req.params.invoiceId, (err, invoice) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (invoice === 404) {
      return notFound(res, `No such invoice with id '${req.params.invoiceId}'`);
    }

    res.send(invoice);
  });
});

exports.getFullInvoiceById = getFullInvoiceById;

function getFullInvoiceById(id, errBack) {
  if (!id) {
    errBack(`invoice id must be provided`, id);
  }

  const getInvoiceSql = mysql.format(
    `
    SELECT
      invoices.id, invoices.invoiceNumber, invoices.invoiceDate, invoices.clientNote,
      invoices.totalCharged, invoices.status, invoices.dateAdded, invoices.addedBy,
      invoices.dateModified, invoices.modifiedBy, addedUser.id addedUserId,
      addedUser.firstName addedFirstName, addedUser.lastName addedLastName,
      modifiedUser.id modifiedUserId, modifiedUser.firstName modifiedUserFirstName,
      modifiedUser.lastName modifiedUserLastName

      FROM invoices
      JOIN users addedUser ON invoices.addedBy = addedUser.id
      JOIN users modifiedUser ON invoices.modifiedBy = modifiedUser.id
    WHERE invoices.id = ?;

    SELECT * FROM invoiceLineItems WHERE invoiceId = ?;

    SELECT * FROM invoiceClients WHERE invoiceId = ?;

    SELECT
      payments.id, payments.paymentDate, payments.paymentAmount, payments.paymentType,
      payments.donationId, payments.dateAdded, payments.addedBy, payments.dateModified,
      payments.modifiedBy, invoicePayments.amoount amountToInvoice
    FROM payments
    JOIN invoicePayments ON invoicePayments.paymentId = payments.id
    JOIN invoices ON invoices.id = invoicePayments.invoiceId
    WHERE invoices.id = ?
  `,
    [id, id, id, id]
  );

  pool.query(getInvoiceSql, (err, result) => {
    if (err) {
      return errBack(err, null);
    }

    const [
      invoiceResult,
      invoiceLineItems,
      invoiceClients,
      invoicePayments,
    ] = result;
    const invoice = invoiceResult[0];

    if (!invoice) {
      errBack(null, 404);
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
      })
    );
  });
}
