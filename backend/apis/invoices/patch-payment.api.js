const {
  app,
  databaseError,
  pool,
  invalidRequest,
  internalError,
  notFound,
  insufficientPrivileges,
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
  nullableValidTags,
} = require("../utils/validation-utils");
const { checkValidPaymentRequestIds } = require("./payment-utils");
const { sumBy } = require("lodash");
const {
  sanitizeTags,
  validTagsList,
  insertTagsQuery,
} = require("../tags/tag.utils");

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
    ...checkValid(req.query, nullableValidTags("tags", user.permissions)),
  ];

  const paymentId = req.params.paymentId;

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const tags = sanitizeTags(req.query.tags);
  const redactedTags = validTagsList.filter((t) => !tags.includes(t));

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

      getFullPaymentById({ paymentId, redactedTags }, (err, oldPayment) => {
        if (err) {
          return databaseError(req, res, err);
        } else if (oldPayment === 404) {
          return notFound(res, `No such payment with id ${paymentId}`);
        } else if (oldPayment.redacted) {
          return insufficientPrivileges(
            res,
            `Payment ${paymentId} is redacted`
          );
        }

        const newPayment = Object.assign({}, oldPayment, req.body);

        const invoiceAmount = sumBy(newPayment.invoices, "amount");

        if (
          invoiceAmount + newPayment.donationAmount >
          newPayment.paymentAmount
        ) {
          return invalidRequest(
            res,
            `Invoice and donation amount exceed the total payment amount`
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

          UPDATE invoices SET status = 'completed'
          WHERE
            id = ?
            AND
            (status = 'draft' OR status = 'open')
            AND invoices.totalCharged <= (
              SELECT SUM (amount) FROM invoicePayments WHERE invoiceId = ?
            )
          ;
        `,
                [paymentId, i.invoiceId, i.amount, i.invoiceId]
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

        insertSql += insertTagsQuery(paymentId, "payments", tags);

        pool.query(insertSql, (err, result) => {
          if (err) {
            return databaseError(req, res, err);
          }

          getFullPaymentById({ paymentId, redactedTags }, (err, payment) => {
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
