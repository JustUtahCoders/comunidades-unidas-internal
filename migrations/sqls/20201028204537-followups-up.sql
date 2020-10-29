CREATE TABLE IF NOT EXISTS followUps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  serviceId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description MEDIUMTEXT,
  dateOfContact DATE,
  appointmentDate DATETIME,
  addedBy INT NOT NULL,
  updatedBy INT NOT NULL,
  FOREIGN KEY (serviceId) REFERENCES services(id),
  FOREIGN KEY (addedBy) REFERENCES users(id),
  FOREIGN KEY (updatedBy) REFERENCES users(id)
)