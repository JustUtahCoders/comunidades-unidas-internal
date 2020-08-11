SELECT
  payments.id, payments.paymentDate, payments.paymentAmount, payments.paymentType,
  payments.donationId, payments.dateAdded, payments.dateModified,
  addedUser.firstName addedFirstName, addedUser.lastName addedLastName,
  modifiedUser.firstName modifiedFirstName, modifiedUser.lastName modifiedLastName,
  JSON_ARRAYAGG(JSON_OBJECT(
    'invoiceId', invoicePayments.invoiceId,
    'amount', invoicePayments.amount
  )) invoices,
  JSON_ARRAYAGG(JSON_OBJECT(
    'clientId', invoiceClients.clientId
  )) invoiceClients,
  JSON_ARRAYAGG(JSON_OBJECT(
    'clientId', paymentClients.clientId,
    'paymentId', paymentClients.paymentId
  )) paymentClients

  FROM payments
  JOIN users addedUser ON payments.addedBy = addedUser.id
  JOIN users modifiedUser ON payments.modifiedBy = modifiedUser.id
  LEFT JOIN paymentClients ON paymentClients.paymentId = payments.id
  LEFT JOIN invoicePayments ON invoicePayments.paymentId = payments.id
  LEFT JOIN invoiceClients ON invoiceClients.invoiceId = invoicePayments.invoiceId
WHERE
  paymentClients.clientId = ?
  OR invoiceClients.clientId = ?
GROUP BY payments.id
;
