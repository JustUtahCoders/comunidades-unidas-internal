const {
  app,
  databaseError,
  pool,
  invalidRequest,
  internalError,
} = require("../../server");
const mariadb = require("mariadb/callback.js");
const { checkValid, nullableValidTags } = require("../utils/validation-utils");
const { getFullInvoiceById } = require("./get-invoice.api");
const {
  sanitizeTags,
  insertTagsQuery,
  validTagsList,
} = require("../tags/tag.utils");
const { runQueriesArray } = require("../utils/mariadb-utils.js");

app.post("/api/invoices", (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = checkValid(
    req.query,
    nullableValidTags("tags", user.permissions)
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const getInvoiceNumberSql = mariadb.format(`
    SELECT id lastInvoiceId FROM invoices ORDER BY id DESC LIMIT 1;
  `);

  pool.query(getInvoiceNumberSql, (err, getInvoiceNumberResult) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const lastInvoiceId =
      getInvoiceNumberResult.length === 0
        ? 0
        : getInvoiceNumberResult[0].lastInvoiceId;

    const invoiceNumber = String(lastInvoiceId + 1).padStart("4", "0");

    const tags = sanitizeTags(req.query.tags);
    const redactedTags = validTagsList.filter((t) => !tags.includes(t));

    const insertQueries = [
      mariadb.format(
        `
        INSERT INTO invoices (invoiceNumber, invoiceDate, addedBy, modifiedBy, status)
        VALUES (?, NOW(), ?, ?, 'draft');

        SET @invoiceId := LAST_INSERT_ID();

        SELECT @invoiceId invoiceId;
      `,
        [invoiceNumber, user.id, user.id]
      ),
      ...insertTagsQuery(
        {
          rawValue: "@invoiceId",
        },
        "invoices",
        tags
      ),
    ];

    runQueriesArray(insertQueries, (err, results) => {
      if (err) {
        return databaseError(req, res, err);
      }

      const [insertResult] = results;

      getFullInvoiceById(
        { id: insertResult[2][0].invoiceId, redactedTags },
        (err, invoice) => {
          if (err) {
            return databaseError(req, res, err);
          }

          if (invoice === 404) {
            return internalError(
              req,
              res,
              `Failed to retrieve invoice from db after inserting it`
            );
          }

          res.send(invoice);
        }
      );
    });
  });
});
