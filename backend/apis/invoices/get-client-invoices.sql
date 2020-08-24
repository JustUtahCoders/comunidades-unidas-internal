SELECT
  invoices.id, invoices.invoiceNumber, invoices.invoiceDate, invoices.clientNote,
  invoices.totalCharged, invoices.status, invoices.dateAdded, invoices.addedBy,
  invoices.dateModified, invoices.modifiedBy, addedUser.id addedUserId,
  addedUser.firstName addedFirstName, addedUser.lastName addedLastName,
  modifiedUser.id modifiedUserId, modifiedUser.firstName modifiedUserFirstName,
  modifiedUser.lastName modifiedUserLastName,
  JSON_ARRAYAGG(JSON_OBJECT(
    'id', li.id,
    'serviceId', li.serviceId,
    'name', li.name,
    'description', li.description,
    'quantity', li.quantity,
    'rate', li.rate
  )) lineItems,
  JSON_ARRAYAGG(JSON_OBJECT(
    'id', p.id,
    'paymentDate', p.paymentDate,
    'amountTowardsInvoice', ip.amount,
    'paymentAmount', p.paymentAmount,
    'paymentType', p.paymentType,
    'donationId', p.donationId,
    'dateAdded', p.dateAdded,
    'addedBy', p.addedBy,
    'dateModified', p.dateModified,
    'modifiedBy', p.modifiedBy
  )) payments,
  JSON_ARRAYAGG(JSON_OBJECT(
    'clientId', invoiceClients.clientId
  )) clients,
  JSON_ARRAYAGG(JSON_OBJECT(
    'id', t.id,
    'tag', t.tag
  )) tags

  FROM invoices
  JOIN invoiceClients ON invoiceClients.invoiceId = invoices.id
  JOIN users addedUser ON invoices.addedBy = addedUser.id
  JOIN users modifiedUser ON invoices.modifiedBy = modifiedUser.id
  LEFT JOIN invoiceLineItems li ON invoices.id = li.invoiceId
  LEFT JOIN invoicePayments ip ON invoices.id = ip.invoiceId
  LEFT JOIN payments p ON p.id = ip.paymentId
  LEFT JOIN tags t ON t.foreignId = invoices.id
WHERE
  invoiceClients.clientId = ? AND (t.foreignTable = "invoices" OR t.foreignId IS NULL)
GROUP BY invoices.id
;