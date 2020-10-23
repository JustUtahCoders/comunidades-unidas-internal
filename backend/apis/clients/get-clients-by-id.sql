SELECT clients.id as clientId,
  clients.isDeleted,
  clients.firstName,
  clients.lastName,
  clients.gender,
  clients.birthday,
  clients.dateAdded as clientDateAdded,
  clients.dateModified as clientDateModified,
  clients.addedBy as createdById,
  clients.modifiedBy as modifiedById,
  intake.id as intakeId,
  intake.clientId,
  intake.dateOfIntake,
  intake.clientSource,
  intake.couldVolunteer,
  intake.dateAdded,
  intake.addedBy,
  contactInfo.*,
  demograph.*,
  created.id as createdById,
  created.firstName as createdByFirstName,
  created.lastName as createdByLastName,
  modified.id as modifiedById,
  modified.firstName as modifiedByFirstName,
  modified.lastName as modifiedByLastName
FROM clients
  INNER JOIN (
    SELECT *
    FROM contactInformation innerContactInformation
      JOIN (
        SELECT clientId latestClientId,
          MAX(dateAdded) latestDateAdded
        FROM contactInformation
        GROUP BY clientId
      ) latestContactInformation ON latestContactInformation.latestDateAdded = innerContactInformation.dateAdded
  ) contactInfo ON contactInfo.clientId = clients.id
  INNER JOIN (
    SELECT *
    FROM demographics innerDemographics
      JOIN (
        SELECT clientId latestClientId,
          MAX(dateAdded) latestDateAdded
        FROM demographics
        GROUP BY clientId
      ) latestDemographics ON latestDemographics.latestDateAdded = innerDemographics.dateAdded
  ) demograph ON demograph.clientId = clients.id
  INNER JOIN (
    SELECT *
    FROM intakeData innerIntake
      JOIN (
        SELECT clientId latestClientId,
          MAX(dateAdded) latestDateAdded
        FROM intakeData
        GROUP BY clientId
      ) latestIntake ON latestIntake.latestDateAdded = innerIntake.dateAdded
  ) intake ON intake.clientId = clients.id
  INNER JOIN users created ON created.id = clients.addedBy
  INNER JOIN users modified ON modified.id = clients.modifiedBy
WHERE clients.id IN (?)
  AND isDeleted = false;
SELECT serviceId,
  serviceName
FROM intakeServices
  JOIN services ON intakeServices.serviceId = services.id
WHERE intakeDataId = (
    SELECT id
    from intakeData
    WHERE clientId IN (?)
    ORDER BY dateAdded DESC
    LIMIT 1
  );