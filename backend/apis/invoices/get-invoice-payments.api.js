const { app, databaseError, pool, invalidRequest } = require("../../server");
const mariadb = require("mariadb/callback.js");
const { checkValid, validId } = require("../utils/validation-utils");
const { formatResponsePayment } = require("./payment-utils");

app.get("/api/invoices/:invoiceId/payments", (req, res) => {
  const invoiceId = req.params.invoiceId;

  const validationErrors = checkValid(req.params, validId("invoiceId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const getSql = mariadb.format(
    `
    SELECT
      payments.id, payments.paymentDate, payments.paymentAmount, payments.paymentType,
      payments.donationId, payments.dateAdded, payments.dateModified,
      addedUser.firstName addedFirstName, addedUser.lastName addedLastName,
      modifiedUser.firstName modifiedFirstName, modifiedUser.lastName modifiedLastName

      FROM payments
      JOIN invoicePayments ON invoicePayments.paymentId = payments.id
      JOIN users addedUser ON payments.addedBy = addedUser.id
      JOIN users modifiedUser ON payments.modifiedBy = modifiedUser.id
    WHERE
      invoicePayments.invoiceId = ?;
  `,
    [invoiceId]
  );

  pool.query(getSql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    res.send({
      payments: result.map((payment) =>
        formatResponsePayment({
          payment,
          createdBy: {
            id: payment.addedUserId,
            firstName: payment.addedFirstName,
            lastName: payment.addedLastName,
          },
          modifiedBy: {
            id: payment.modifiedId,
            firstName: payment.modifiedFirstName,
            lastName: payment.modifiedLastName,
          },
        })
      ),
    });
  });
});
