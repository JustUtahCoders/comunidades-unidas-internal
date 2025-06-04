const { app, databaseError, pool, invalidRequest } = require("../../server");
const mariadb = require("mariadb");
const {
  checkValid,
  validId,
  nullableValidTags,
} = require("../utils/validation-utils");
const { formatResponsePayment } = require("./payment-utils");
const path = require("path");
const { sanitizeTags, validTagsList } = require("../tags/tag.utils");
const ejs = require("ejs");

const rawGetSqlPromise = ejs.renderFile(
  path.join(__dirname, "./get-client-payments.sql"),
  { detachedPayments: false }
);

app.get("/api/clients/:clientId/payments", async (req, res) => {
  const user = req.session.passport.user;
  const clientId = req.params.clientId;

  const validationErrors = [
    ...checkValid(req.params, validId("clientId")),
    ...checkValid(req.query, nullableValidTags("tags", user.permissions)),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const tags = sanitizeTags(req.query.tags);
  const redactedTags = validTagsList.filter((t) => !tags.includes(t));

  const rawGetSql = await rawGetSqlPromise;
  const getSql = mariadb.format(rawGetSql, [clientId, clientId]);

  pool.query(getSql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    res.send({
      payments: result.map((payment) =>
        formatResponsePayment({
          payment,
          invoices: payment.invoices,
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
          paymentTags: payment.paymentTags
            .filter((t) => t.foreignTable === "payments")
            .map((t) => t.tag)
            .filter(Boolean),
          redactedTags,
        })
      ),
    });
  });
});
