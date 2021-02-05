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
  nullableValidDateTime,
  validCurrency,
  nullableValidCurrency,
  nullableValidTags,
  nullableValidInteger,
  nullableNonEmptyString,
} = require("../utils/validation-utils");
const { checkValidPaymentRequestIds } = require("./payment-utils");
const { sumBy } = require("lodash");
const {
  sanitizeTags,
  validTagsList,
  insertTagsQuery,
} = require("../tags/tag.utils");
const {
  insertActivityLogQuery,
} = require("../clients/client-logs/activity-log.utils");

app.patch("/api/payments/:paymentId", (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.params, validId("paymentId")),
    ...checkValid(
      req.body,
      nullableValidDateTime("paymentDate"),
      nullableValidInteger("donationAmount"),
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
      nullableValidArray("payerClientIds", validId),
      nullableNonEmptyString("payerName")
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
            `Invoice and donation amount exceed the total payment amount. Total amount: ${newPayment.paymentAmount}. Invoice Amount: ${invoiceAmount}. Donation Amount: ${newPayment.donationAmount}`
          );
        }

        let insertSql = mysql.format(
          `
        UPDATE payments SET
          paymentDate = ?, paymentAmount = ?, paymentType = ?, payerName = ?, modifiedBy = ?
          WHERE id = ?
        ;


      `,
          [
            newPayment.paymentDate,
            newPayment.paymentAmount,
            newPayment.paymentType,
            newPayment.payerName,
            user.id,
            newPayment.id,
          ]
        );

        if (newPayment.donationAmount !== oldPayment.donationAmount) {
          if (oldPayment.donationId) {
            if (newPayment.donationAmount === 0) {
              insertSql += mysql.format(
                `
                UPDATE payments SET donationId = NULL WHERE id = ?;

                DELETE FROM donations WHERE id = ?;
              `,
                [newPayment.id, oldPayment.donationId]
              );
            } else {
              insertSql += mysql.format(
                `
                UPDATE donations SET donationAmount = ?
                WHERE id = ?;
              `,
                [newPayment.donationAmount, newPayment.donationId]
              );
            }
          } else {
            insertSql += mysql.format(
              `
              INSERT INTO donations (donationAmount, donationDate, addedBy, modifiedBy)
              VALUES (?, ?, ?, ?);

              UPDATE payments SET donationId = LAST_INSERT_ID() WHERE id = ?;
            `,
              [
                newPayment.donationAmount,
                newPayment.paymentDate,
                user.id,
                user.id,
                newPayment.id,
              ]
            );
          }
        }

        if (req.body.invoices) {
          insertSql += mysql.format(
            `
              UPDATE invoices SET status = 'open' WHERE id IN (
                SELECT invoiceId FROM invoicePayments WHERE paymentId = ?
              );

              DELETE FROM invoicePayments WHERE paymentId = ?;
            `,
            [paymentId, paymentId]
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
                [paymentId, i.invoiceId, i.amount, i.invoiceId, i.invoiceId]
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

        newPayment.payerClientIds.forEach((clientId) => {
          insertSql += insertActivityLogQuery({
            clientId,
            title: `Payment #${String(newPayment.id).padStart(
              4,
              "0"
            )} was updated`,
            description: null,
            logType: "payment:updated",
            addedBy: user.id,
            detailId: newPayment.id,
          });
        });

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
