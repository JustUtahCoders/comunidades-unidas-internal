const {
  app,
  databaseError,
  pool,
  invalidRequest,
  internalError,
} = require("../../server");
const mysql = require("mysql");
const { getFullPaymentById } = require("./get-payment.api");
const {
  checkValid,
  validArray,
  validId,
  validEnum,
  validDate,
  validCurrency,
  nullableValidCurrency,
} = require("../utils/validation-utils");
const { checkValidPaymentRequestIds } = require("./payment-utils");
const {
  sanitizeTags,
  validTagsList,
  insertTagsQuery,
} = require("../tags/tag.utils");

app.post("/api/payments", (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = checkValid(
    req.body,
    validDate("paymentDate"),
    validArray("invoices", (index) => {
      return (invoices) => {
        const errs = checkValid(
          invoices[index],
          validId("invoiceId"),
          validCurrency("amount")
        );
        return errs.length > 0 ? errs : null;
      };
    }),
    validCurrency("paymentAmount"),
    validEnum("paymentType", "cash", "credit", "debit", "check", "other"),
    validArray("payerClientIds", validId),
    nullableValidCurrency("donationAmount")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const tags = sanitizeTags(req.query.tags);
  const redactedTags = validTagsList.filter((t) => !tags.includes(t));

  checkValidPaymentRequestIds(
    {
      invoiceIds: req.body.invoices.map((i) => i.invoiceId),
      payerClientIds: req.body.payerClientIds,
    },
    (err, invalidMsg) => {
      if (err) {
        return databaseError(req, res, err);
      } else if (invalidMsg) {
        return invalidRequest(res, invalidMsg);
      }

      let insertSql = "";

      if (req.body.donationAmount) {
        insertSql += mysql.format(
          `
          INSERT INTO donations
          (donationAmount, donationDate, addedBy, modifiedBy)
          VALUES (?, ?, ?, ?);

          SET @donationId := LAST_INSERT_ID();
        `,
          [req.body.donationAmount, req.body.paymentDate, user.id, user.id]
        );
      } else {
        insertSql += `
          SET @donationId := NULL;
        `;
      }

      insertSql += mysql.format(
        `
      INSERT INTO payments
      (paymentDate, paymentAmount, paymentType, addedBy, modifiedBy, donationId)
      VALUES
      (?, ?, ?, ?, ?, @donationId);

      SET @paymentId := LAST_INSERT_ID();

      ${req.body.invoices
        .map((i) =>
          mysql.format(
            `
        INSERT INTO invoicePayments
        (paymentId, invoiceId, amount)
        VALUES
        (@paymentId, ?, ?);

        UPDATE invoices SET status = 'completed'
        WHERE
          id = ?
          AND
          (status = 'draft' OR status = 'open')
          AND totalCharged <= (
            SELECT SUM (amount) FROM invoicePayments WHERE invoiceId = ?
          )
        ;
      `,
            [i.invoiceId, i.amount, i.invoiceId, i.invoiceId]
          )
        )
        .join("\n")}

      ${req.body.payerClientIds
        .map((c) =>
          mysql.format(
            `
        INSERT INTO paymentClients (paymentId, clientId)
        VALUES (@paymentId, ?);
      `,
            [c]
          )
        )
        .join("\n")}

      ${insertTagsQuery({ rawValue: "@paymentId" }, "payments", tags)}
      SELECT @paymentId paymentId;
    `,
        [
          req.body.paymentDate,
          req.body.paymentAmount,
          req.body.paymentType,
          user.id,
          user.id,
        ]
      );

      pool.query(insertSql, (err, result) => {
        if (err) {
          return databaseError(req, res, err);
        }

        const paymentId = result[result.length - 1][0].paymentId;

        getFullPaymentById({ paymentId, redactedTags }, (err, payment) => {
          if (err) {
            return databaseError(req, res, err);
          }

          res.send(payment);
        });
      });
    }
  );
});
