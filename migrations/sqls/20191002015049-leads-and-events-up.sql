CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  eventName VARCHAR(64) NOT NULL,
  eventLocation VARCHAR(64) NOT NULL,
  totalAttendence INT,
  isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  dateModified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  addedBy INT NOT NULL,
  modifiedBy INT NOT NULL,
  FOREIGN KEY (addedBy) REFERENCES users(id),
  FOREIGN KEY (modifiedBy) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dateOfSignUp DATE,
  leadStatus ENUM("active", "inactive", "convertedToClient"),
  firstContactAttempt DATETIME DEFAULT CURRENT_TIMESTAMP,
  secondContactAttempt DATETIME DEFAULT CURRENT_TIMESTAMP,
  thirdContactAttempt DATETIME DEFAULT CURRENT_TIMESTAMP,
  inactivityReason ENUM("doNotCallRequest", "threeAttemptsNoResponce", "wrongNumber", "noLongerInterested", "relocated"),
  eventSource INT NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  smsConsent BOOLEAN DEFAULT false,
  zip VARCHAR(32),
  age INT,
  gender VARCHAR(64) ,
  isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  dateModified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  addedBy int NOT NULL,
  modifiedBy int NOT NULL,
  FOREIGN KEY (eventSource) REFERENCES events(id),
  FOREIGN KEY (addedBy) REFERENCES users(id),
  FOREIGN KEY (modifiedBy) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS leadServices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  leadId INT NOT NULL,
  serviceId INT NOT NULL,
  FOREIGN KEY (leadId) REFERENCES leads(id),
  FOREIGN KEY (serviceId) REFERENCES services(id)
);

CREATE TABLE IF NOT EXISTS leadToClient (
  id INT AUTO_INCREMENT PRIMARY KEY,
  leadId INT,
  clientId INT,
  FOREIGN KEY (leadId) REFERENCES leads(id),
  FOREIGN KEY (clientId) REFERENCES clients(id)
);