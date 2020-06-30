CREATE TABLE programmaticUsers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(256) NOT NULL,
  password VARCHAR(512) NOT NULL,
  userId INT NOT NULL,
  expirationDate DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);