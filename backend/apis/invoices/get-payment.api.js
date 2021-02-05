const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound,
} = require("../../server");
const mysql = require("mysql");
const {
  checkValid,
  validId,
  nullableValidTags,
} = require("../utils/validation-utils");
const { formatResponsePayment } = require("./payment-utils");
const {
  sanitizeTags,
  validTagsList,
  insertTagsQuery,
} = require("../tags/tag.utils");

app.get("/api/payments/:paymentId", (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.params, validId("paymentId")),
    ...checkValid(req.query, nullableValidTags("tags", user.permissions)),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const tags = sanitizeTags(req.query.tags);
  const redactedTags = validTagsList.filter((t) => !tags.includes(t));

  getFullPaymentById(
    { paymentId: req.params.paymentId, redactedTags },
    (err, payment) => {
      if (err) {
        databaseError(req, res, err);
      } else if (payment === 404) {
        notFound(res, `No payment found with id ${req.params.paymentId}`);
      } else {
        res.send(payment);
      }
    }
  );
});

exports.getFullPaymentById = getFullPaymentById;

function getFullPaymentById({ paymentId, redactedTags }, errBack) {
  if (typeof paymentId !== "number" && typeof paymentId !== "string") {
    return errBack(`Invalid payment id`);
  }

  const getPaymentSql = mysql.format(
    `
    SELECT
      payments.id, payments.paymentDate, payments.paymentAmount, payments.paymentType,
      payments.donationId, payments.payerName, payments.dateAdded, payments.dateModified,
      addedUser.firstName addedFirstName, addedUser.lastName addedLastName,
      modifiedUser.firstName modifiedFirstName, modifiedUser.lastName modifiedLastName,
      donations.donationAmount donationAmount

      FROM payments
      LEFT JOIN donations ON donations.id = payments.donationId
      JOIN users addedUser ON payments.addedBy = addedUser.id
      JOIN users modifiedUser ON payments.modifiedBy = modifiedUser.id
    WHERE payments.id = ? AND payments.isDeleted = false;

    SELECT invoicePayments.paymentId, invoicePayments.invoiceId, invoicePayments.amount,
      invoices.status, invoices.totalCharged, invoices.invoiceNumber
    FROM invoicePayments JOIN invoices ON invoices.id = invoicePayments.invoiceId
    WHERE paymentId = ?;

    SELECT paymentId, clientId FROM paymentClients WHERE paymentId = ?;

    SELECT tags.tag, tags.id FROM tags WHERE tags.foreignTable = "payments" AND tags.foreignId = ?;
  `,
    [paymentId, paymentId, paymentId, paymentId]
  );

  pool.query(getPaymentSql, (err, result) => {
    if (err) {
      return errBack(err);
    } else if (result[0].length === 0) {
      return errBack(null, 404);
    } else {
      const [paymentResult, invoices, payerClientIds, tags] = result;
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
          paymentTags: tags.map((t) => t.tag),
          redactedTags,
        })
      );
    }
  });
}
