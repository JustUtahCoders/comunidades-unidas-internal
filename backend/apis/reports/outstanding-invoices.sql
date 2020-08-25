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
  LEFT JOIN tags ON tags.foreignId = invoices.id
  LEFT JOIN invoicePayments ON invoicePayments.invoiceId = invoices.id
  LEFT JOIN payments ON invoicePayments.paymentId = payments.id
  LEFT JOIN invoiceClients ON invoiceClients.invoiceId = invoices.id
  JOIN clients ON clients.id = invoiceClients.clientId
  JOIN (
    SELECT *
    FROM
      contactInformation innerContactInformation
      JOIN (
        SELECT clientId latestClientId, MAX(dateAdded) latestDateAdded
        FROM contactInformation GROUP BY clientId
      ) latestContactInformation
      ON latestContactInformation.latestDateAdded = innerContactInformation.dateAdded
  ) contactInfo ON contactInfo.clientId = clients.id
WHERE
  (invoices.status = 'open' OR invoices.status = 'completed')
  AND
  (tags.foreignTable IS NULL OR tags.foreignTable = "invoices")
  -- AND
  -- (invoices.invoiceDate >= ? AND invoices.invoiceDate <= ?)
  AND
  (payments.isDeleted IS NULL OR payments.isDeleted = false)
GROUP BY invoices.id
;