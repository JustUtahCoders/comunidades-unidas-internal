const { responseUser } = require("../utils/transform-utils");
const mysql = require("mysql");
const { pool } = require("../../server");
const { intersection, uniqBy } = require("lodash");

exports.formatResponsePayment = function formatResponsePayment({
  payment,
  createdBy,
  modifiedBy,
  invoices,
  payerClientIds,
  paymentTags,
  redactedTags,
}) {
  const redact = intersection(paymentTags, redactedTags).length > 0;

  const result = {
    id: payment.id,
    paymentDate: payment.paymentDate,
    paymentAmount: redact ? null : payment.paymentAmount,
    paymentType: payment.paymentType,
    payerName: payment.payerName,
    donationId: payment.donationId || null,
    donationAmount: redact ? null : payment.donationAmount || null,
    redacted: redact,
    createdBy: responseUser(createdBy, payment.dateAdded),
    modifiedBy: responseUser(modifiedBy, payment.dateModified),
  };

  if (invoices) {
    result.invoices = uniqBy(invoices, "paymentId")
      .filter((i) => i.invoiceId !== null && i.amount !== null)
      .map((i) => {
        const result = {
          invoiceId: i.invoiceId,
          amount: redact ? null : i.amount,
        };

        if (i.status) {
          result.status = i.status;
        }

        if (i.totalCharged) {
          result.totalCharged = redact ? null : i.totalCharged;
        }

        if (i.invoiceNumber) {
          result.invoiceNumber = i.invoiceNumber;
        }

        return result;
      });
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
