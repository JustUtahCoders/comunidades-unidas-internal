const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound,
} = require("../../server");
const mysql = require("mysql");
const { checkValid, validId } = require("../utils/validation-utils");
const { formatResponsePayment } = require("./payment-utils");

app.get("/api/payments/:paymentId", (req, res) => {
  const validationErrors = checkValid(req.params, validId("paymentId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  getFullPaymentById(req.params.paymentId, (err, payment) => {
    if (err) {
      databaseError(req, res, err);
    } else if (payment === 404) {
      notFound(res, `No payment found with id ${req.params.paymentId}`);
    } else {
      res.send(payment);
    }
  });
});

exports.getFullPaymentById = getFullPaymentById;

function getFullPaymentById(paymentId, errBack) {
  if (typeof paymentId !== "number" && typeof paymentId !== "string") {
    return errBack(`Invalid payment id`);
  }

  const getPaymentSql = mysql.format(
    `
    SELECT
      payments.id, payments.paymentDate, payments.paymentAmount, payments.paymentType,
      payments.donationId, payments.dateAdded, payments.dateModified,
      addedUser.firstName addedFirstName, addedUser.lastName addedLastName,
      modifiedUser.firstName modifiedFirstName, modifiedUser.lastName modifiedLastName,
      donations.donationAmount donationAmount

      FROM payments
      LEFT JOIN donations ON donations.id = payments.donationId
      JOIN users addedUser ON payments.addedBy = addedUser.id
      JOIN users modifiedUser ON payments.modifiedBy = modifiedUser.id
    WHERE payments.id = 13 AND payments.isDeleted = false;

    SELECT invoicePayments.paymentId, invoicePayments.invoiceId, invoicePayments.amount,
      invoices.status, invoices.totalCharged, invoices.invoiceNumber
    FROM invoicePayments JOIN invoices ON invoices.id = invoicePayments.invoiceId
    WHERE paymentId = ?;

    SELECT paymentId, clientId FROM paymentClients WHERE paymentId = ?;
  `,
    [paymentId, paymentId, paymentId]
  );

  pool.query(getPaymentSql, (err, result) => {
    if (err) {
      return errBack(err);
    } else if (result[0].length === 0) {
      return errBack(null, 404);
    } else {
      const [paymentResult, invoices, payerClientIds] = result;
      const [payment] = paymentResult;

      return errBack(
        null,
        formatResponsePayment({
          payment,
          invoices,
          payerClientIds,
          createdBy: {
            firstName: payment.addedFirstName,
            lastName: payment.addedLastName,
          },
          modifiedBy: {
            firstName: payment.modifiedFirstName,
            lastName: payment.modifiedLastName,
          },
        })
      );
    }
  });
}
