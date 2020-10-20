SELECT id, firstName, lastName, email, accessLevel, JSON_ARRAYAGG(userPermissions.permission) permissions
FROM
  users
  LEFT JOIN
  userPermissions ON userPermissions.userId = users.id
WHERE id = ?
GROUP BY users.id
;