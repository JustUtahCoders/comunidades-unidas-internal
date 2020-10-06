SELECT
  leadReferrals.id, leadReferrals.dateAdded, leadReferrals.referralDate,
  leadReferrals.partnerServiceId, partnerServices.name partnerServiceName,
  partners.name partnerName
FROM
  leadReferrals
  JOIN
  partnerServices ON leadReferrals.partnerServiceId = partnerServices.id
  JOIN
  partners ON partners.id = partnerServices.partnerId
WHERE
  isDeleted = false
  AND 
  leadId = ?;