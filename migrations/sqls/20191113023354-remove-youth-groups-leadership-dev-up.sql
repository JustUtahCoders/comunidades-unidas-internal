SELECT @oldID := id FROM services WHERE serviceName = 'Youth Groups / Leadership Development';
SELECT @newID := id FROM services WHERE serviceName = 'Youth Groups';

UPDATE
  `intakeServices`
SET
    serviceId = @newID
WHERE
    serviceId = @oldID;

DELETE FROM `services` WHERE id = @oldID;