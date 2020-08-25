-- Program and Services
SELECT
  services.id serviceId, services.serviceName, programs.id programId,
  programs.programName
FROM
  services
  JOIN programs on services.programId = programs.id
;

-- Service payments
SELECT
  payments.id paymentId, invoicePayments.amount, JSON_ARRAYAGG(JSON_OBJECT(
    'serviceId', invoiceLineItems.serviceId,
    'quantity', quantity,
    'rate', rate
  )) lineItems
FROM
  invoicePayments
  JOIN invoices ON invoices.id = invoicePayments.invoiceId
  JOIN payments ON payments.id = invoicePayments.paymentId
  LEFT JOIN invoiceLineItems ON invoiceLineItems.invoiceId = invoices.id
WHERE
  invoiceLineItems.serviceId IS NOT NULL
  AND invoices.invoiceDate >= ?
  AND invoices.invoiceDate <= ?
  AND payments.isDeleted = false
GROUP BY payments.id
;

-- Invoice totals
SELECT
  SUM(invoicePayments.amount) invoiceTotal
FROM invoicePayments
  JOIN invoices ON invoicePayments.invoiceId = invoices.id
  JOIN payments on invoicePayments.paymentId = payments.id
WHERE
  invoices.invoiceDate >= ? AND invoices.invoiceDate <= ?
  AND payments.isDeleted = false
;

-- Payment totals
SELECT
  SUM(paymentAmount) allPaymentsTotal
FROM payments
WHERE
  payments.paymentDate >= ? AND payments.paymentDate <= ?
  AND payments.isDeleted = false
;

-- Donation totals
SELECT
  SUM(donationAmount) donationsTotal
FROM donations
WHERE
  (donations.donationDate >= ? AND donations.donationDate <= ?)
  AND donations.isDeleted = false
;
