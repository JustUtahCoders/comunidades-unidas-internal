const {
  app,
  databaseError,
  pool,
  invalidRequest,
  internalError,
} = require("../../server");
const mariadb = require("mariadb/callback.js");
const { getFullPaymentById } = require("./get-payment.api");
const {
  checkValid,
  validArray,
  validId,
  validEnum,
  validDate,
  validCurrency,
  nullableValidCurrency,
  nullableNonEmptyString,
} = require("../utils/validation-utils");
const { checkValidPaymentRequestIds } = require("./payment-utils");
const {
  sanitizeTags,
  validTagsList,
  insertTagsQuery,
} = require("../tags/tag.utils");
const {
  insertActivityLogQuery,
} = require("../clients/client-logs/activity-log.utils");
const { runQueriesArray } = require("../utils/mariadb-utils.js");
const { flattenDeep } = require("lodash-es");

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
    nullableNonEmptyString("payerName"),
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

      let insertQueries = [];

      if (req.body.donationAmount) {
        insertQueries.push(
          mariadb.format(
            `
          INSERT INTO donations
          (donationAmount, donationDate, addedBy, modifiedBy)
          VALUES (?, ?, ?, ?);

          SET @donationId := LAST_INSERT_ID();
        `,
            [req.body.donationAmount, req.body.paymentDate, user.id, user.id]
          )
        );
      } else {
        insertQueries.push(
          mariadb.format(`
            SET @donationId := NULL;
          `)
        );
      }

      insertQueries.push(
        mariadb.format(
          `
          INSERT INTO payments
          (paymentDate, paymentAmount, paymentType, payerName, addedBy, modifiedBy, donationId)
          VALUES
          (?, ?, ?, ?, ?, ?, @donationId);

          SET @paymentId := LAST_INSERT_ID();
        `,
          [
            req.body.paymentDate,
            req.body.paymentAmount,
            req.body.paymentType,
            req.body.payerName || null,
            user.id,
            user.id,
          ]
        )
      );

      insertQueries.push(
        ...req.body.invoices.map((i) =>
          mariadb.format(
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
      );

      insertQueries.push(
        ...req.body.payerClientIds.map((c) =>
          mariadb.format(
            `
        INSERT INTO paymentClients (paymentId, clientId)
        VALUES (@paymentId, ?);
      `,
            [c]
          )
        )
      );

      insertQueries.push(
        ...insertTagsQuery({ rawValue: "@paymentId" }, "payments", tags)
      );

      insertQueries.push(
        ...flattenDeep(
          req.body.payerClientIds.map((clientId) =>
            insertActivityLogQuery({
              clientId,
              title: {
                rawValue: `CONCAT('Client payment #', (SELECT LPAD(@paymentId, 4, '0')), ' was created')`,
              },
              description: null,
              logType: "payment:created",
              addedBy: user.id,
              detailId: { rawValue: "@paymentId" },
            })
          )
        )
      );

      insertQueries.push(`SELECT @paymentId paymentId;`);

      runQueriesArray(insertQueries, (err, result) => {
        if (err) {
          return databaseError(req, res, err);
        }

        const paymentId = Number(result[1][0].insertId);

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
