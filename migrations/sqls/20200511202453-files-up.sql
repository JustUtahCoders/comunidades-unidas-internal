CREATE table clientFiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  clientId INT NOT NULL,
  s3Key VARCHAR(256) NOT NULL,
  fileName VARCHAR(256) NOT NULL,
  fileSize INT NOT NULL,
  fileExtension VARCHAR(32) NOT NULL,
  isDeleted BOOLEAN DEFAULT false,
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  addedBy INT NOT NULL,
  FOREIGN KEY (addedBy) REFERENCES users(id),
  FOREIGN KEY (clientId) REFERENCES clients(id)
);