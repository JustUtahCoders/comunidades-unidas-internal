const {
  app,
  databaseError,
  pool,
  invalidRequest,
  internalError,
  notFound,
} = require("../../server");
const mysql = require("mysql2");
const { checkValid, validId } = require("../utils/validation-utils");
const { getFullPaymentById } = require("./get-payment.api");

app.delete("/api/payments/:paymentId", (req, res) => {
  const validationErrors = checkValid(req.params, validId("paymentId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const paymentId = req.params.paymentId;

  getFullPaymentById({ paymentId: req.params.paymentId }, (err, payment) => {
    if (err) {
      databaseError(req, res, err);
    } else if (payment === 404) {
      notFound(res, `No payment found with id ${req.params.paymentId}`);
    } else {
      const deleteSql = mysql.format(
        `
        UPDATE payments SET isDeleted = true WHERE id = ?;

        UPDATE donations SET isDeleted = true
        WHERE
          id IS NOT NULL
          AND id = (
            SELECT donationId FROM payments WHERE payments.id = ?
          )
        ;
      `,
        [paymentId, paymentId]
      );

      pool.query(deleteSql, (err, result) => {
        if (err) {
          return databaseError(req, res, err);
        }

        res.status(204).end();
      });
    }
  });
});
