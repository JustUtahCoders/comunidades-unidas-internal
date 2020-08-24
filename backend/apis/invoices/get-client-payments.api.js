const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");
const {
  checkValid,
  validId,
  nullableValidTags,
} = require("../utils/validation-utils");
const { formatResponsePayment } = require("./payment-utils");
const fs = require("fs");
const path = require("path");
const {
  sanitizeTags,
  validTagsList,
  insertTagsQuery,
} = require("../tags/tag.utils");

const rawGetSql = fs.readFileSync(
  path.join(__dirname, "./get-client-payments.sql")
);

app.get("/api/clients/:clientId/payments", (req, res) => {
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
          paymentTags: JSON.parse(payment.paymentTags)
            .map((t) => t.tag)
            .filter(Boolean),
          redactedTags,
        })
      ),
    });
  });
});
