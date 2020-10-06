SELECT
  COUNT(*) referralCount, partnerServices.id partnerServiceId
FROM
  clientReferrals
  JOIN
  partnerServices ON partnerServices.id = clientReferrals.partnerServiceId
  JOIN
  partners ON partners.id = partnerServices.partnerId
WHERE
  (clientReferrals.referralDate BETWEEN ? AND ?)
GROUP BY
  clientReferrals.partnerServiceId
;

SELECT
  COUNT(*) referralCount, partners.id partnerId, partnerServices.id partnerServiceId,
  partners.name partnerName, partnerServices.name partnerServicesName
FROM
  leadReferrals
  JOIN
  partnerServices ON partnerServices.id = leadReferrals.partnerServiceId
  JOIN
  partners ON partners.id = partnerServices.partnerId
WHERE
  (leadReferrals.referralDate BETWEEN ? AND ?)
GROUP BY
  leadReferrals.partnerServiceId
;

SELECT
  partners.name partnerName, partners.id partnerId,
  partnerServices.name partnerServiceName, partnerServices.id partnerServiceId
FROM
  partners
  LEFT JOIN
  partnerServices ON partners.id = partnerServices.partnerId
;