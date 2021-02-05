SELECT
  payments.id, payments.paymentDate, payments.paymentAmount, payments.paymentType,
  payments.donationId, payments.dateAdded, payments.dateModified, payments.payerName,
  addedUser.firstName addedFirstName, addedUser.lastName addedLastName,
  modifiedUser.firstName modifiedFirstName, modifiedUser.lastName modifiedLastName,
  donations.id donationId, donations.donationAmount donationAmount,
  JSON_ARRAYAGG(JSON_OBJECT(
    'invoiceId', invoicePayments.invoiceId,
    'amount', invoicePayments.amount,
    'paymentId', invoicePayments.paymentId
  )) invoices,
  JSON_ARRAYAGG(JSON_OBJECT(
    'clientId', invoiceClients.clientId
  )) invoiceClients,
  JSON_ARRAYAGG(JSON_OBJECT(
    'clientId', paymentClients.clientId,
    'paymentId', paymentClients.paymentId
  )) paymentClients,
  JSON_ARRAYAGG(JSON_OBJECT(
    'tag', tags.tag,
    'id', tags.id
  )) paymentTags

  FROM payments
  JOIN users addedUser ON payments.addedBy = addedUser.id
  JOIN users modifiedUser ON payments.modifiedBy = modifiedUser.id
  LEFT JOIN donations ON donations.id = payments.donationId
  LEFT JOIN paymentClients ON paymentClients.paymentId = payments.id
  LEFT JOIN invoicePayments ON invoicePayments.paymentId = payments.id
  LEFT JOIN invoiceClients ON invoiceClients.invoiceId = invoicePayments.invoiceId
  LEFT JOIN tags ON (tags.foreignId = payments.id AND tags.foreignTable = 'payments')
WHERE
<% if (detachedPayments) { %>
  invoiceClients.clientId IS NULL
<% } else { %>
  (paymentClients.clientId = ? OR invoiceClients.clientId = ?)
<% } %>
  AND
  payments.isDeleted = false
GROUP BY payments.id
;
