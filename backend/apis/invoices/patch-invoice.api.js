const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound,
  internalError,
} = require("../../server");
const mysql = require("mysql");
const { getFullInvoiceById } = require("./get-invoice.api");
const {
  checkValid,
  validId,
  nonEmptyString,
  nullableNonEmptyString,
  nullableValidCurrency,
  nullableValidEnum,
  validCurrency,
  nullableValidArray,
  validInteger,
  nullableValidDate,
} = require("../utils/validation-utils");
const { uniq, uniqBy } = require("lodash");

app.patch("/api/invoices/:invoiceId", (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.params, validId("invoiceId")),
    ...checkValid(
      req.body,
      nullableNonEmptyString("invoiceNumber"),
      nullableValidDate("invoiceDate"),
      nullableNonEmptyString("clientNote"),
      nullableValidCurrency("totalCharged"),
      nullableValidEnum("status", "draft", "open", "completed", "closed"),
      nullableValidArray("clients", validId)
      // nullableValidArray("lineItems", (index) => {
      //   return (lineItems) => {
      //     const errs = checkValid(
      //       lineItems[index],
      //       validId("serviceId"),
      //       nonEmptyString("name"),
      //       nullableNonEmptyString("description"),
      //       validInteger("quantity"),
      //       validCurrency("rate")
      //     );
      //     return errs.length > 0 ? errs : null;
      //   };
      // })
    ),
    Object.keys(req.body).length === 0 &&
      `Must provide request body with properties to update`,
    req.body.status === null && `Status must not be null`,
  ].filter(Boolean);

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  if (
    req.body.clients &&
    uniq(req.body.clients).length !== req.body.clients.length
  ) {
    return invalidRequest(
      res,
      `Invalid request body - duplicate client ids in "clients" array`
    );
  }

  let { invoiceId } = req.params;
  invoiceId = Number(invoiceId);

  getFullInvoiceById(invoiceId, (err, oldInvoice) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (oldInvoice === 404) {
      return notFound(res, `No such invoice with id ${invoiceId}`);
    }

    const newInvoice = Object.assign({}, oldInvoice, req.body);

    if (
      oldInvoice.status === "draft" &&
      oldInvoice.lineItems.length === 0 &&
      req.body.lineItems &&
      req.body.lineItems.length > 0
    ) {
      newInvoice.status = "open";
    }

    let updateSql = mysql.format(
      `
      UPDATE invoices
      SET
        invoiceNumber = ?, invoiceDate = ?, clientNote = ?, totalCharged = ?,
        status = ?, modifiedBy = ?
      WHERE id = ?;
    `,
      [
        newInvoice.invoiceNumber,
        newInvoice.invoiceDate,
        newInvoice.clientNote,
        newInvoice.totalCharged,
        newInvoice.status,
        user.id,
        invoiceId,
      ]
    );

    if (req.body.clients) {
      updateSql += mysql.format(
        `
        DELETE FROM invoiceClients WHERE invoiceId = ?;

        ${req.body.clients
          .map((clientId) =>
            mysql.format(
              `
          INSERT INTO invoiceClients (clientId, invoiceId)
          VALUES (?, ?);
        `,
              [clientId, invoiceId]
            )
          )
          .join("\n")}
      `,
        [invoiceId]
      );
    }

    if (req.body.lineItems) {
      updateSql += mysql.format(
        `
        DELETE FROM invoiceLineItems WHERE invoiceId = ?;

        ${req.body.lineItems
          .map((li) =>
            mysql.format(
              `
          INSERT INTO invoiceLineItems
          (invoiceId, serviceId, name, description, quantity, rate)
          VALUES (?, ?, ?, ?, ?, ?);
        `,
              [
                invoiceId,
                li.serviceId,
                li.name,
                li.description,
                li.quantity,
                li.rate,
              ]
            )
          )
          .join("\n")}
      `,
        [invoiceId]
      );
    }

    pool.query(updateSql, (err, updateResult) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return invalidRequest(res, {
            message: `Invoice number '${newInvoice.invoiceNumber}' is already taken`,
            invoiceNumberDuplicate: true,
          });
        } else if (err.code === "ER_NO_REFERENCED_ROW_2") {
          const isClientId = err.message.includes("invoiceClients");
          return invalidRequest(res, {
            message: `Invalid ${
              isClientId ? "client" : "payment"
            } id(s) in PATCH body.`,
          });
        } else {
          return databaseError(req, res, err);
        }
      }

      return getFullInvoiceById(invoiceId, (err, responseInvoice) => {
        if (err) {
          return databaseError(req, res, err);
        }

        if (responseInvoice === 404) {
          return internalError(
            req,
            res,
            `Could not retrieve invoice after updating it`
          );
        }

        res.send(responseInvoice);
      });
    });
  });
});
