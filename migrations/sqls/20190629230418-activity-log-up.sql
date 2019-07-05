CREATE TABLE IF NOT EXISTS clientLogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description MEDIUMTEXT,
  logType ENUM (
    'clientCreated',
    'clientUpdated:basicInformation',
    'clientUpdated:contactInformation',
    'clientUpdated:demographics',
    'clientUpdated:intakeData',
    'caseNote'
  ) NOT NULL,
  detailId INT,
  isDeleted BOOLEAN DEFAULT false NOT NULL,
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  addedBy int NOT NULL,
  FOREIGN KEY (clientId) REFERENCES clients(id),
  FOREIGN KEY (addedBy) REFERENCES users(id)
);

/* Not a perfect migration (misses some things and creates too many of others), but good enough */

/* Insert all the clientCreated log entries */
INSERT INTO clientLogs
  (clientId, title, logType, detailId, isDeleted, dateAdded, addedBy)
  SELECT clients.id, "Client was created", "clientCreated", clients.id, false, clients.dateAdded, clients.addedBy
  FROM clients;

INSERT INTO clientLogs
  (clientId, title, logType, detailId, isDeleted, dateAdded, addedBy)
  SELECT contactInformation.clientId, "Contact information was updated", "clientUpdated:contactInformation", contactInformation.id, false, contactInformation.dateAdded, contactInformation.addedBy
  FROM contactInformation;

INSERT INTO clientLogs
  (clientId, title, logType, detailId, isDeleted, dateAdded, addedBy)
  SELECT demographics.clientId, "Demographics information was updated", "clientUpdated:demographics", demographics.id, false, demographics.dateAdded, demographics.addedBy
  FROM demographics;

INSERT INTO clientLogs
  (clientId, title, logType, detailId, isDeleted, dateAdded, addedBy)
  SELECT intakeData.clientId, "Intake data was updated", "clientUpdated:intakeData", intakeData.id, false, intakeData.dateAdded, intakeData.addedBy
  FROM intakeData;