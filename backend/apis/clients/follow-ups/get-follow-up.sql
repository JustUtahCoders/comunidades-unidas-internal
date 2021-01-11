SELECT
followUps.id, followUps.clientId, followUps.title, followUps.description, followUps.dateOfContact, followUps.appointmentDate, followUps.duration, JSON_ARRAYAGG(followUpServices.serviceId) AS serviceIds,
JSON_OBJECT(
  "userId", addedUser.id,
  "firstName", addedUser.firstName,
  "lastName", addedUser.lastName
  ) createdBy,
JSON_OBJECT(
  "userId", updatedBy.id,
  "firstName", updatedBy.firstName,
  "lastName", updatedBy.lastName
  ) lastUpdatedBy
FROM followUps
JOIN users addedUser ON followUps.addedBy = addedUser.id
JOIN users updatedBy ON followUps.updatedBy = updatedBy.id
LEFT JOIN followUpServices ON followUpServices.followUpId = ? WHERE followUps.id = ?;