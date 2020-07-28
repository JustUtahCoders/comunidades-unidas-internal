const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");
const { checkValid, validId } = require("../utils/validation-utils");
const { formatResponsePayment } = require("./payment-utils");

app.get("/api/clients/:clientId/payments", (req, res) => {
  const clientId = req.params.clientId;

  const validationErrors = checkValid(req.params, validId("clientId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const getSql = mysql.format(
    `
    SELECT
      payments.id, payments.paymentDate, payments.paymentAmount, payments.paymentType,
      payments.donationId, payments.dateAdded, payments.dateModified,
      addedUser.firstName addedFirstName, addedUser.lastName addedLastName,
      modifiedUser.firstName modifiedFirstName, modifiedUser.lastName modifiedLastName

      FROM payments
      JOIN paymentClients ON paymentClients.paymentId = payments.id
      JOIN users addedUser ON payments.addedBy = addedUser.id
      JOIN users modifiedUser ON payments.modifiedBy = modifiedUser.id
    WHERE
      paymentClients.clientId = ?;
  `,
    [clientId]
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
