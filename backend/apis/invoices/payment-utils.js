const { responseUser } = require("../utils/transform-utils");
const mysql = require("mysql");
const { pool } = require("../../server");

exports.formatResponsePayment = function formatResponsePayment({
  payment,
  createdBy,
  modifiedBy,
  invoices,
  payerClientIds,
}) {
  const result = {
    id: payment.id,
    paymentDate: payment.paymentDate,
    paymentAmount: payment.paymentAmount,
    paymentType: payment.paymentType,
    createdBy: responseUser(createdBy, payment.dateAdded),
    modifiedBy: responseUser(modifiedBy, payment.dateModified),
  };

  if (invoices) {
    result.invoices = invoices.map((i) => ({
      invoiceId: i.invoiceId,
      amount: i.amount,
    }));
  }

  if (payerClientIds) {
    result.payerClientIds = payerClientIds.map((p) => p.clientId);
  }

  return result;
};

exports.checkValidPaymentRequestIds = function checkValidPaymentRequestIds(
  { invoiceIds = [], payerClientIds = [] },
  errBack
) {
  if (invoiceIds.length === 0 && payerClientIds.length === 0) {
    return errBack(null, null);
  }

  let checkExistenceSql = invoiceIds
    .map((invoiceId) =>
      mysql.format(
        `
    SELECT COUNT(*) cnt FROM invoices WHERE id = ?;
  `,
        [invoiceId]
      )
    )
    .join("\n");

  checkExistenceSql += payerClientIds
    .map((clientId) =>
      mysql.format(
        `
    SELECT COUNT(*) cnt FROM clients WHERE id = ? AND isDeleted = false;
  `,
        [clientId]
      )
    )
    .join("\n");

  pool.query(checkExistenceSql, (err, result) => {
    if (err) {
      return errBack(err, null);
    } else {
      result =
        invoiceIds.length + payerClientIds.length > 1 ? result : [result];
      const invalidIndex = result.findIndex((r) => r[0].cnt !== 1);
      if (invalidIndex >= 0) {
        const isInvoiceId = invalidIndex < invoiceIds.length;
        const id = isInvoiceId
          ? invoiceIds[invalidIndex]
          : payerClientIds[invalidIndex - invoiceIds.length];
        return errBack(
          null,
          `Invalid ${isInvoiceId ? "invoice" : "client"} id ${id}`
        );
      } else {
        return errBack(null, null);
      }
    }
  });
};
