const {
  app,
  databaseError,
  pool,
  insufficientPrivileges,
} = require("../../server");
const mysql = require("mysql");
const fs = require("fs");
const path = require("path");
const { checkUserRole } = require("../utils/auth-utils");
const { responseFullName } = require("../utils/transform-utils");

const sql = fs.readFileSync(
  path.resolve(__dirname, "./list-users.sql"),
  "utf-8"
);

const allPermissionNames = ["immigration"];

app.get("/api/users", (req, res) => {
  const authError = checkUserRole(req, "Administrator");

  if (authError) {
    return insufficientPrivileges(res, authError);
  }

  const query = mysql.format(sql, []);

  pool.query(query, (err, users) => {
    if (err) {
      return databaseError(req, res, err);
    }

    res.send({
      users: users.map((u) => {
        const perms = JSON.parse(u.permissions);
        return {
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          fullName: responseFullName(u.firstName, u.lastName),
          email: u.email,
          accessLevel: u.accessLevel,
          permissions: allPermissionNames.reduce((result, permName) => {
            result[permName] = perms.includes(permName);
            return result;
          }, {}),
        };
      }),
    });
  });
});
