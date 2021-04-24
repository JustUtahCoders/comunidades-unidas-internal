CREATE VIEW latestContactInformation AS
SELECT *
FROM contactInformation
WHERE id IN (
  SELECT max(id) FROM contactInformation GROUP BY clientId
)
;

CREATE VIEW latestDemographics AS
SELECT *
FROM demographics
WHERE id IN (
  SELECT max(id) FROM demographics GROUP BY clientId
)
;

CREATE VIEW latestIntakeData AS
SELECT *
FROM intakeData
WHERE id IN (
  SELECT max(id) FROM intakeData GROUP BY clientId
)
;