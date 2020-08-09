const {
  app,
  databaseError,
  pool,
  invalidRequest,
  internalError,
} = require("../../server");
const mysql = require("mysql");
const { getFullInvoiceById } = require("./get-invoice.api");

app.post("/api/invoices", (req, res) => {
  const user = req.session.passport.user;

  const getInvoiceNumberSql = mysql.format(`
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

    const insertSql = mysql.format(
      `
      INSERT INTO invoices (invoiceNumber, invoiceDate, addedBy, modifiedBy, status)
      VALUES (?, ?, ?, ?, 'draft');

      SELECT LAST_INSERT_ID() invoiceId;
    `,
      [invoiceNumber, new Date(), user.id, user.id]
    );

    pool.query(insertSql, (err, insertResult) => {
      if (err) {
        return databaseError(req, res, err);
      }

      getFullInvoiceById(insertResult[1][0].invoiceId, (err, invoice) => {
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
      });
    });
  });
});
