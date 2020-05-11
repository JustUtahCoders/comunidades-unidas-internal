CREATE table clientFiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  s3Key VARCHAR(256),
  fileName VARCHAR(256),
  fileSize INT,
  fileExtension VARCHAR(32),
  isDeleted BOOLEAN DEFAULT false,
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  addedBy INT,
  FOREIGN KEY (addedBy) REFERENCES users(id)
);