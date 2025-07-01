UPDATE users SET accessLevel = ? WHERE id = ? AND isDeleted = false;

INSERT IGNORE INTO
  userPermissions (userId, permission)
  SELECT ?, 'immigration' WHERE ?
;

DELETE FROM
  userPermissions
  WHERE
  userId = ? AND permission = 'immigration' AND ?
;