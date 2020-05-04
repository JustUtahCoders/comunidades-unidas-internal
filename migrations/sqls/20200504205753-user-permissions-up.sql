CREATE TABLE userPermissions (
  userId INT NOT NULL,
  permission VARCHAR(64) NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id),
  CONSTRAINT uniquePermission UNIQUE (userId, permission)
)