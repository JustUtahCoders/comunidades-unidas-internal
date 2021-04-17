SELECT
  invoices.id, invoices.invoiceNumber, invoices.totalCharged,
  SUM(invoicePayments.amount) totalPaid,
  JSON_ARRAYAGG(JSON_OBJECT(
    'clientId', invoiceClients.clientId,
    'firstName', clients.firstName,
    'lastName', clients.lastName,
    'primaryPhone', contactInfo.primaryPhone
  )) clientsWhoOwe,
  JSON_ARRAYAGG(JSON_OBJECT(
    'tag', tags.tag
  )) tags
FROM
  invoices
  LEFT JOIN tags ON (tags.foreignId = invoices.id AND tags.foreignTable = 'invoices')
  LEFT JOIN invoicePayments ON invoicePayments.invoiceId = invoices.id
  LEFT JOIN payments ON invoicePayments.paymentId = payments.id
  LEFT JOIN invoiceClients ON invoiceClients.invoiceId = invoices.id
  JOIN clients ON clients.id = invoiceClients.clientId
  JOIN latestContactInformation contactInfo ON contactInfo.clientId = clients.id
WHERE
  (invoices.status = 'open' OR invoices.status = 'completed')
  AND
  (invoices.invoiceDate >= ? AND invoices.invoiceDate <= ?)
  AND
  (payments.isDeleted IS NULL OR payments.isDeleted = false)
GROUP BY invoices.id
;