CREATE TABLE IF NOT EXISTS clientInteractions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clientInteractionType ENUM (
        'clientInteractionCreated',
        'clientInteractionUpdated',
        'clientInteractionDeleted'
    ) NOT NULL,
    clientId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    serviceId INT NOT NULL,
    interactionType ENUM (
        'in pesron',
        'by phone',
        'workshop/talk',
        'one on one/light touch',
        'consultation'
    ) NOT NULL,
    description MEDIUMTEXT,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    duration TIME DEFAULT '0:00:00' NOT NULL,
    location ENUM (
        'CU Office',
        'Consulate Office',
        'Community Event'
    ) NOT NULL,
    canModify BOOLEAN DEFAULT false NOT NULL,
    isDeleted BOOLEAN DEFAULT false NOT NULL,
    dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    addedBy int NOT NULL,
    FOREIGN KEY (clientId) REFERENCES clients(id),
    FOREIGN KEY (addedBy) REFERENCES users(id),
    FOREIGN KEY (serviceId) REFERENCES services(id)
);