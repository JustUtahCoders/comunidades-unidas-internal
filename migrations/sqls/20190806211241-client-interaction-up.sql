CREATE TABLE IF NOT EXISTS clientInteractions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clientId INT NOT NULL,
    serviceId INT NOT NULL,
    interactionType ENUM (
        'inPerson',
        'byPhone',
        'workshopTalk',
        'oneOnOneLightTouch',
        'consultation'
    ) NOT NULL,
    dateofInteraction DATE DEFAULT CURRENT_DATE NOT NULL,
    duration TIME DEFAULT '0:00:00' NOT NULL,
    location ENUM (
        'CUOffice',
        'consulateOffice',
        'communityEvent'
    ) NOT NULL,
    isDeleted BOOLEAN DEFAULT false NOT NULL,
    dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    addedBy int NOT NULL,
    dateModified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    modifiedBy int NOT NULL /*Self Reference to User ID*/, 
    FOREIGN KEY (clientId) REFERENCES clients(id),
    FOREIGN KEY (addedBy) REFERENCES users(id),
    FOREIGN KEY (modifiedBy) REFERENCES users(id),
    FOREIGN KEY (serviceId) REFERENCES services(id)
);

ALTER TABLE clientLogs
    MODIFY COLUMN
        logType enum (
            'clientCreated',
            'clientUpdated:basicInformation',
            'clientUpdated:contactInformation',
            'clientUpdated:demographics',
            'clientUpdated:intakeData',
            'caseNote',
            'clientInteraction:created',
            'clientInteraction:updated',
            'clientInteraction:deleted'
        ) NOT NULL;   
