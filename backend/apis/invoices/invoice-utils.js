const { sum } = require("lodash");
const { responseUser } = require("../utils/transform-utils");

exports.formatResponseInvoice = function formatResponseInvoice({
  invoice,
  createdByUser,
  modifiedByUser,
  invoicePayments,
  invoiceClients,
  invoiceLineItems,
}) {
  const result = {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: invoice.invoiceDate,
    clientNote: invoice.clientNote,
    totalCharged: invoice.totalCharged,
    status: invoice.status,
    createdBy: responseUser(createdByUser, invoice.dateAdded),
    modifiedBy: responseUser(modifiedByUser, invoice.dateModified),
  };

  if (invoicePayments) {
    result.payments = invoicePayments.map((ip) => ({
      paymentId: ip.id,
      amount: ip.amount,
    }));

    result.totalPaid = sum(invoicePayments.map((ip) => ip.paymentAmount));
  }

  if (invoiceLineItems) {
    result.lineItems = invoiceLineItems.map((li) => ({
      serviceId: li.serviceId,
      name: li.name,
      description: li.description,
      rate: li.rate,
    }));
  }

  if (invoiceClients) {
    result.clients = invoiceClients.map((ic) => ic.clientId);
  }

  return result;
};
