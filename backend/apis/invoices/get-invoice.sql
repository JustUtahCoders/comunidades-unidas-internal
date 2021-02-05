SELECT invoices.id,
  invoices.invoiceNumber,
  invoices.invoiceDate,
  invoices.clientNote,
  invoices.totalCharged,
  invoices.status,
  invoices.dateAdded,
  invoices.addedBy,
  invoices.dateModified,
  invoices.modifiedBy,
  invoices.billTo,
  addedUser.id addedUserId,
  addedUser.firstName addedFirstName,
  addedUser.lastName addedLastName,
  modifiedUser.id modifiedUserId,
  modifiedUser.firstName modifiedUserFirstName,
  modifiedUser.lastName modifiedUserLastName
FROM invoices
  JOIN users addedUser ON invoices.addedBy = addedUser.id
  JOIN users modifiedUser ON invoices.modifiedBy = modifiedUser.id
WHERE invoices.id = ?;
SELECT *
FROM invoiceLineItems
WHERE invoiceId = ?;
SELECT clientId
FROM invoiceClients
WHERE invoiceId = ?;
SELECT payments.id,
  payments.paymentDate,
  payments.paymentAmount,
  payments.paymentType,
  payments.donationId,
  payments.dateAdded,
  payments.addedBy,
  payments.dateModified,
  payments.modifiedBy,
  invoicePayments.amount amountTowardsInvoice
FROM payments
  JOIN invoicePayments ON invoicePayments.paymentId = payments.id
  JOIN invoices ON invoices.id = invoicePayments.invoiceId
WHERE invoices.id = ?;
SELECT id,
  foreignId,
  tag
FROM tags
WHERE foreignTable = "invoices"
  AND foreignId = ?;