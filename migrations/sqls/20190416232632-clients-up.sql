/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS clients (
  id int AUTO_INCREMENT PRIMARY KEY,
  firstName nvarchar(255) NOT NULL,
  lastName nvarchar(255) NOT NULL,
  dob date,
  gender varchar(64),  /*Gender constraint at front end */
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  dateModified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  addedBy int NOT NULL /*Self Reference to User ID*/,
  modifiedBy int NOT NULL /*Self Reference to User ID*/,
  FOREIGN KEY (addedBy) REFERENCES users(userId),
  FOREIGN KEY (modifiedBy) REFERENCES users(userId)
);