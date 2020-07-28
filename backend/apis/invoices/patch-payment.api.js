const {
  app,
  databaseError,
  pool,
  invalidRequest,
  internalError,
  notFound,
} = require("../../server");
const mysql = require("mysql");
const { getFullPaymentById } = require("./get-payment.api");
const {
  checkValid,
  nullableValidArray,
  validId,
  nullableValidEnum,
  nullableValidDate,
  validCurrency,
  nullableValidCurrency,
} = require("../utils/validation-utils");
const { checkValidPaymentRequestIds } = require("./payment-utils");
const { sumBy } = require("lodash");

app.patch("/api/payments/:paymentId", (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.params, validId("paymentId")),
    ...checkValid(
      req.body,
      nullableValidDate("paymentDate"),
      nullableValidArray("invoices", (index) => {
        return (invoices) => {
          const errs = checkValid(
            invoices[index],
            validId("invoiceId"),
            validCurrency("amount")
          );
          return errs.length > 0 ? errs : null;
        };
      }),
      nullableValidCurrency("paymentAmount"),
      nullableValidEnum(
        "paymentType",
        "cash",
        "credit",
        "debit",
        "check",
        "other"
      ),
      nullableValidArray("payerClientIds", validId)
    ),
  ];

  const paymentId = req.params.paymentId;

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  checkValidPaymentRequestIds(
    {
      invoiceIds: (req.body.invoices || []).map((i) => i.invoiceId),
      payerClientIds: req.body.payerClientIds,
    },
    (err, invalidMsg) => {
      if (err) {
        return databaseError(req, res, err);
      } else if (invalidMsg) {
        return invalidRequest(res, invalidMsg);
      }

      getFullPaymentById(paymentId, (err, oldPayment) => {
        if (err) {
          return databaseError(req, res, err);
        } else if (oldPayment === 404) {
          return notFound(res, `No such payment with id ${paymentId}`);
        }

        const newPayment = Object.assign({}, oldPayment, req.body);

        const invoiceAmount = sumBy(newPayment.invoices, "amount");

        if (invoiceAmount !== newPayment.paymentAmount) {
          return invalidRequest(
            res,
            `Invoice payment amounts must total to payment amount. Invoice amount: ${invoiceAmount}, Total amount: ${newPayment.paymentAmount}`
          );
        }

        let insertSql = mysql.format(
          `
        UPDATE payments SET
          paymentDate = ?, paymentAmount = ?, paymentType = ?, modifiedBy = ?;


      `,
          [
            newPayment.paymentDate,
            newPayment.paymentAmount,
            newPayment.paymentType,
            user.id,
          ]
        );

        if (req.body.invoices) {
          insertSql += mysql.format(
            `DELETE FROM invoicePayments WHERE paymentId = ?;`,
            [paymentId]
          );

          insertSql += req.body.invoices
            .map((i) =>
              mysql.format(
                `
          INSERT INTO invoicePayments
          (paymentId, invoiceId, amount)
          VALUES
          (?, ?, ?);
        `,
                [paymentId, i.invoiceId, i.amount]
              )
            )
            .join("\n");
        }

        if (req.body.payerClientIds) {
          insertSql += mysql.format(
            `
          DELETE FROM paymentClients WHERE paymentId = ?;
        `,
            [paymentId]
          );

          insertSql += req.body.payerClientIds
            .map((c) =>
              mysql.format(
                `
          INSERT INTO paymentClients (paymentId, clientId)
          VALUES (?, ?);
        `,
                [paymentId, c]
              )
            )
            .join("\n");
        }

        pool.query(insertSql, (err, result) => {
          if (err) {
            return databaseError(req, res, err);
          }

          getFullPaymentById(paymentId, (err, payment) => {
            if (err) {
              return databaseError(req, res, err);
            }

            res.send(payment);
          });
        });
      });
    }
  );
});
