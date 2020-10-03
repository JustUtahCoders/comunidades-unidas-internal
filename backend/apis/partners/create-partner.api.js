const mysql = require("mysql");
const { app, pool, invalidRequest } = require("../../server");
const { checkUserRole } = require("../utils/auth-utils");
const {
  checkValid,
  nonEmptyString,
  validBoolean,
} = require("../utils/validation-utils");
const fs = require("fs");
const path = require("path");

const insertSql = fs.readFileSync(
  path.resolve(__dirname, "./create-partner.sql")
);
const getSql = fs.readFileSync(path.resolve(__dirname, "./get-partner.sql"));

app.post("/api/partners", (req, res, next) => {
  const authError = checkUserRole(req, "Administrator");

  if (authError) {
    return insufficientPrivileges(res, authError);
  }

  const validationErrors = checkValid(
    req.body,
    nonEmptyString("name"),
    validBoolean("isActive")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const user = req.session.passport.user;
  const query = mysql.format(insertSql, [
    req.body.name,
    req.body.isActive,
    user.id,
    user.id,
  ]);

  pool.query(query, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    getPartner({ id: result.insertId }, (err, partner) => {
      if (err) {
        return databaseError(req, res, err);
      }

      res.send(partner);
    });
  });
});

function getPartner({ id, includeInactive = false }, errBack) {
  const query = mysql.format(getSql, [id, true, !includeInactive]);
  pool.query(query, (err, result) => {
    if (err) {
      return errBack(err, null);
    } else if (result.length === 0) {
      errBack(null, 404);
    } else {
      const partner = result[0];
      errBack(null, {
        id: partner.id,
        name: partner.name,
        isActive: Boolean(partner.isActive),
        dateAdded: partner.dateAdded,
        addedBy: partner.addedBy,
        dateModified: partner.dateModified,
        modifiedBy: partner.modifiedBy,
      });
    }
  });
}

exports.getPartner = getPartner;
