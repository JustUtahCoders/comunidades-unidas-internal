const {
  app,
  databaseError,
  pool,
  insufficientPrivileges,
  invalidRequest,
} = require("../../server");
const mariadb = require("mariadb");
const fs = require("fs");
const path = require("path");
const { checkUserRole } = require("../utils/auth-utils");
const {
  checkValid,
  nullableValidEnum,
  validBoolean,
  validId,
} = require("../utils/validation-utils");
const { atLeastOne } = require("../utils/patch-utils");

const getSql = fs.readFileSync(
  path.resolve(__dirname, "./get-user.sql"),
  "utf-8"
);
const insertSql = fs.readFileSync(
  path.resolve(__dirname, "./patch-user.sql"),
  "utf-8"
);

app.patch("/api/users/:userId", (req, res) => {
  const authError = checkUserRole(req, "Administrator");

  if (authError) {
    return insufficientPrivileges(res, authError);
  }

  const validationErrors = [
    ...checkValid(req.params, validId("userId")),
    ...checkValid(
      req.body,
      nullableValidEnum("accessLevel", "Administrator", "Staff", "Manager")
    ),
    ...(req.body.permissions
      ? checkValid(req.body.permissions, validBoolean("immigration"))
      : null),
    atLeastOne(req.body, "accessLevel", "permissions")
      ? null
      : `accessLevel or permissions must be provided`,
  ].filter(Boolean);

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const userId = Number(req.params.userId);

  const getQuery = mariadb.format(getSql, [userId]);

  pool.query(getQuery, (err, getResult) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const finalUser = { ...getResult[0], ...req.body };

    const insertQuery = mariadb.format(insertSql, [
      finalUser.accessLevel,
      userId,
      userId,
      finalUser.permissions.immigration,
      userId,
      !finalUser.permissions.immigration,
    ]);

    pool.query(insertQuery, (err, result) => {
      if (err) {
        return databaseError(req, res, err);
      }

      res.send(finalUser);
    });
  });
});
