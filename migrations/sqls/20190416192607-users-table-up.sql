/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS users (
  id int AUTO_INCREMENT PRIMARY KEY,
  googleId varchar(64) NOT NULL UNIQUE,
  firstName varchar(64) NOT NULL,
  lastName varchar(64) NOT NULL,
  email varchar(255) NOT NULL,
  accessLevel ENUM('Administrator','Manager','Staff') NOT NULL
);