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
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    title ENUM (
        'Client interaction created for Preventive Health: Chronic Disease Screenings',
        'Client interaction created for Nutrition / CRYS / SNAP: SNAP',
        'Client interaction created for Nutrition / CRYS / SNAP: Nutrition',
        'Client interaction created for Nutrition / CRYS / SNAP: Grocery Store Tour',
        'Client interaction created for Nutrition / CRYS / SNAP: Cooking Classes',
        'Client interaction created for Immigration: Citizenship',
        'Client interaction created for Immigration: Family Petition',
        'Client interaction created for Immigration: DACA',
        'Client interaction created for Financial Education: Financial Coach',
        'Client interaction created for Financial Education: Financial Education',
        'Client interaction created for Workers' Rights: Workers' Rights and Safety',
        'Client interaction created for Community Engagement and Organizing: Leadership Development',
        'Client interaction created for Community Engagement and Organizing: Youth Groups'
    ),
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
            'clientInteractionCreated',
            'clientInteractionUpdated',
            'clientInteractionDeleted'
        ) NOT NULL
    
