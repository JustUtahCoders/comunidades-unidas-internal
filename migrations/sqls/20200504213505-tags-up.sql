CREATE TABLE tags (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  foreignId INT NOT NULL,
  foreignTable VARCHAR(128),
  tag VARCHAR(64),
  CONSTRAINT uniqueTag UNIQUE (foreignId, foreignTable, tag)
);