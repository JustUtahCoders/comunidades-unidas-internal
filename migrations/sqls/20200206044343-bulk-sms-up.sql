CREATE TABLE IF NOT EXISTS bulkSms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  twilioSid VARCHAR(128) NOT NULL,
  clientsMatched INT NOT NULL,
  clientsWithPhone INT NOT NULL,
  leadsMatched INT NOT NULL,
  leadsWithPhone INT NOT NULL,
  uniquePhoneNumbers INT NOT NULL,
  smsBody VARCHAR(2048) NOT NULL,
  addedBy INT NOT NULL,
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (addedBy) REFERENCES users(id)
);

CREATE TABLE bulkSmsRecipients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(32) NOT NULL,
  bulkSmsId INT NOT NULL,
  leadId INT,
  clientId INT,
  FOREIGN KEY (bulkSmsId) REFERENCES bulkSms(id),
  FOREIGN KEY (leadId) REFERENCES leads(id),
  FOREIGN KEY (clientId) REFERENCES clients(id)
);