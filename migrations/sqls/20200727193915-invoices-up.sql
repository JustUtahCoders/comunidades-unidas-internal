CREATE TABLE invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoiceNumber VARCHAR(32) NOT NULL UNIQUE,
  invoiceDate DATE NOT NULL,
  clientNote MEDIUMTEXT,
  totalCharged DECIMAL(15, 2),
  status ENUM ('draft', 'open', 'completed', 'closed'),
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  addedBy INT NOT NULL,
  dateModified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  modifiedBy INT NOT NULL, 
  FOREIGN KEY (addedBy) REFERENCES users(id),
  FOREIGN KEY (modifiedBy) REFERENCES users(id)
);

CREATE TABLE donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  donationAmount DECIMAL(15, 2),
  donationDate DATE DEFAULT (CURDATE()) NOT NULL,
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  addedBy INT NOT NULL,
  dateModified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  modifiedBy INT NOT NULL, 
  FOREIGN KEY (addedBy) REFERENCES users(id),
  FOREIGN KEY (modifiedBy) REFERENCES users(id)
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  isDeleted BOOL NOT NULL DEFAULT FALSE,
  paymentDate DATETIME NOT NULL,
  paymentAmount DECIMAL(15, 2),
  paymentType ENUM('cash', 'credit', 'debit', 'check', 'other'),
  donationId INT NULL,
  dateAdded DATETIME DEFAULT (CURDATE()) NOT NULL,
  addedBy INT NOT NULL,
  dateModified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  modifiedBy INT NOT NULL, 
  FOREIGN KEY (addedBy) REFERENCES users(id),
  FOREIGN KEY (modifiedBy) REFERENCES users(id),
  FOREIGN KEY (donationId) REFERENCES donations(id)
);

CREATE TABLE invoiceLineItems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoiceId INT NOT NULL,
  serviceId INT NULL,
  name VARCHAR(256) NOT NULL,
  description VARCHAR(512) NOT NULL,
  quantity INT NULL,
  rate DECIMAL(15, 2),
  FOREIGN KEY (serviceId) REFERENCES services(id),
  FOREIGN KEY (invoiceId) REFERENCES invoices(id)
);

CREATE TABLE invoiceClients (
  clientId INT NOT NULL,
  invoiceId INT NOT NULL,
  FOREIGN KEY (clientId) REFERENCES clients(id),
  FOREIGN KEY (invoiceId) REFERENCES invoices(id),
  UNIQUE KEY unique_row (clientId, invoiceId)
);

CREATE TABLE invoicePayments (
  paymentId INT NOT NULL,
  invoiceId INT NOT NULL,
  amount DECIMAL(15, 2),
  FOREIGN KEY (paymentId) REFERENCES payments(id),
  FOREIGN KEY (invoiceId) REFERENCES invoices(id),
  UNIQUE KEY unique_row (paymentId, invoiceId)
);

CREATE TABLE paymentClients (
  paymentId INT NOT NULL,
  clientId INT NOT NULL,
  FOREIGN KEY (paymentId) REFERENCES payments(id),
  FOREIGN KEY (clientId) REFERENCES clients(id),
  UNIQUE KEY unique_row (paymentId, clientId)
)