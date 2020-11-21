CREATE TABLE IF NOT EXISTS followUps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description MEDIUMTEXT,
  dateOfContact DATETIME NOT NULL,
  appointmentDate DATETIME,
  duration TIME DEFAULT '0:00:00' NOT NULL,
  addedBy INT NOT NULL,
  updatedBy INT NOT NULL,
  FOREIGN KEY (clientId) REFERENCES clients(id),
  FOREIGN KEY (addedBy) REFERENCES users(id),
  FOREIGN KEY (updatedBy) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS followUpServices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  serviceId INT NOT NULL,
  followUpId INT NOT NULL,
  FOREIGN KEY (serviceId) REFERENCES services(id),
  FOREIGN KEY (followUpId) REFERENCES followUps(id)
);