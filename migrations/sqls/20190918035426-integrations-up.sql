CREATE TABLE integrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  integrationType VARCHAR(10) NOT NULL,
  status ENUM (
    'enabled',
    'disabled',
    'broken'
  ) NOT NULL,
  lastSync DATETIME,
  externalId VARCHAR(128),

  CONSTRAINT fk_integ_client_id FOREIGN KEY (clientId) REFERENCES clients(id),
  CONSTRAINT unique_integration UNIQUE (clientId, integrationType)
);