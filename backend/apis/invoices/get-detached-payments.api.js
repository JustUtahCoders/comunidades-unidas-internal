const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");
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
  { detachedPayments: true }
);

app.get("/api/detached-payments", async (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.query, nullableValidTags("tags", user.permissions)),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const rawGetSql = await rawGetSqlPromise;
  const tags = sanitizeTags(req.query.tags);
  const redactedTags = validTagsList.filter((t) => !tags.includes(t));

  const getSql = mysql.format(rawGetSql, []);

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
          paymentTags: JSON.parse(payment.paymentTags)
            .filter((t) => t.foreignTable === "payments")
            .map((t) => t.tag)
            .filter(Boolean),
          redactedTags,
        })
      ),
    });
  });
});
