const { sum, uniqBy, intersection } = require("lodash");
const {
  responseUser,
  responseDateWithoutTime,
} = require("../utils/transform-utils");

exports.formatResponseInvoice = function formatResponseInvoice({
  invoice,
  createdByUser,
  modifiedByUser,
  invoicePayments,
  invoiceClients,
  invoiceLineItems,
  invoiceTags,
  redactedTags,
}) {
  const redact = intersection(invoiceTags, redactedTags).length > 0;

  invoicePayments = invoicePayments
    ? invoicePayments.filter((ip) => ip.id)
    : invoicePayments;

  invoiceLineItems = invoiceLineItems
    ? invoiceLineItems.filter((li) => li.id)
    : invoiceLineItems;

  const result = {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: responseDateWithoutTime(invoice.invoiceDate),
    clientNote: redact ? null : invoice.clientNote,
    totalCharged: redact ? null : invoice.totalCharged,
    status: invoice.status,
    billTo: invoice.billTo || null,
    redacted: redact,
    createdBy: responseUser(createdByUser, invoice.dateAdded),
    modifiedBy: responseUser(modifiedByUser, invoice.dateModified),
  };

  if (invoicePayments) {
    result.payments = uniqBy(invoicePayments, "id").map((ip) => ({
      paymentId: ip.id,
      paymentAmount: redact ? null : ip.paymentAmount,
      amountTowardsInvoice: redact ? null : ip.amountTowardsInvoice,
    }));

    result.totalPaid = redact
      ? null
      : sum(invoicePayments.map((ip) => ip.paymentAmount));
  }

  if (invoiceLineItems) {
    result.lineItems = redact
      ? []
      : uniqBy(invoiceLineItems, "id").map((li) => ({
          serviceId: li.serviceId,
          name: li.name,
          description: li.description,
          quantity: li.quantity,
          rate: li.rate,
        }));
  }

  if (invoiceClients) {
    result.clients = uniqBy(invoiceClients, "clientId").map(
      (ic) => ic.clientId
    );
  }

  return result;
};
