SELECT
partners.id, partners.name, partners.isActive, partners.dateAdded, partners.addedBy,
partners.dateModified, partners.modifiedBy,
JSON_ARRAYAGG(JSON_OBJECT(
  'id', partnerServices.id,
  'name', partnerServices.name,
  'isActive', partnerServices.isActive,
  'dateAdded', partnerServices.dateAdded,
  'dateModified', partnerServices.dateModified,
  'addedBy', partnerServices.addedBy,
  'modifiedBy', partnerServices.modifiedBy
)) services
FROM partners
LEFT JOIN partnerServices ON partnerServices.partnerId = partners.id
WHERE
  (partners.isActive = true OR partners.isActive = ?)
  AND
  (partnerServices.isActive IS NULL OR partnerServices.isActive = true OR partnerServices.isActive = ?)
GROUP BY partners.id
;