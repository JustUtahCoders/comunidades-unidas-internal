const { sum, uniqBy } = require("lodash");
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
}) {
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
    clientNote: invoice.clientNote,
    totalCharged: invoice.totalCharged,
    status: invoice.status,
    createdBy: responseUser(createdByUser, invoice.dateAdded),
    modifiedBy: responseUser(modifiedByUser, invoice.dateModified),
  };

  if (invoicePayments) {
    result.payments = uniqBy(invoicePayments, "id").map((ip) => ({
      paymentId: ip.id,
      paymentAmount: ip.paymentAmount,
      amountTowardsInvoice: ip.amountTowardsInvoice,
    }));

    result.totalPaid = sum(invoicePayments.map((ip) => ip.paymentAmount));
  }

  if (invoiceLineItems) {
    result.lineItems = uniqBy(invoiceLineItems, "id").map((li) => ({
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
