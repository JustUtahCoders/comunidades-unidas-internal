const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");
const { checkValid, validId } = require("../utils/validation-utils");
const { formatResponsePayment } = require("./payment-utils");
const fs = require("fs");
const path = require("path");

const rawGetSql = fs.readFileSync(
  path.join(__dirname, "./get-client-payments.sql")
);

app.get("/api/clients/:clientId/payments", (req, res) => {
  const clientId = req.params.clientId;

  const validationErrors = checkValid(req.params, validId("clientId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const getSql = mysql.format(rawGetSql, [clientId, clientId]);

  pool.query(getSql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    res.send({
      payments: result.map((payment) =>
        formatResponsePayment({
          payment,
          invoices: JSON.parse(payment.invoices),
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
