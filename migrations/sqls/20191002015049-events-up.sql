CREATE TABLE events (
	id INT AUTO_INCREMENT PRIMARY KEY,
	eventName VARCHAR(64) NOT NULL,
	eventLocation VARCHAR(64) NOT NULL,
	totalAttendence INT,
	isDeleted BOOLEAN DEFAULT false,dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  dateModified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  addedBy int NOT NULL,
  modifiedBy int NOT NULL,
  FOREIGN KEY (addedBy) REFERENCES users(id),
  FOREIGN KEY (modifiedBy) REFERENCES users(id)
);

CREATE TABLE leads (
	id INT AUTO_INCREMENT PRIMARY KEY,
	dateOfSignUp DATE,
	leadStatus ENUM("active", "inactive", "convertedToClient"),
	contactStage FIXME
	inactivityReason ENUM("doNotCallRequest", "threeAttemptsNoResponce", "wrongNumber", "noLongerInterested", "relocated"),
	eventSource INT NOT NULL,
	firstName VARCHAR(255) NOT NULL,
	lastName VARCHAR(255) NOT NULL,
	phone VARCHAR(32) NOT NULL,
	smsConsent BOOLEAN DEFAULT false,
	zip VARCHAR(32),
	age INT,
	gender VARCHAR(64) ,
	isDeleted BOOLEAN DEFAULT false NOT NULL,
	dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  dateModified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  addedBy int NOT NULL,
  modifiedBy int NOT NULL,
  FOREIGN KEY (eventSource) REFERENCES events(id),
  FOREIGN KEY (addedBy) REFERENCES users(id),
  FOREIGN KEY (modifiedBy) REFERENCES users(id)
	
);

CREATE TABLE leadServices (
	id INT AUTO_INCREMENT PRIMARY KEY,
	leadId INT NOT NULL,
	serviceId INT NOT NULL,
	FOREIGN KEY (leadId) REFERENCES leads(id),
	FOREIGN KEY (serviceId) REFERENCES services(id)
);