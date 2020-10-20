UPDATE users SET accessLevel = ? WHERE id = ?;

INSERT IGNORE INTO
  userPermissions (userId, permission)
  SELECT ?, 'immigration' WHERE ?
;

DELETE FROM
  userPermissions
  WHERE
  userId = ? AND permission = 'immigration' AND ?
;