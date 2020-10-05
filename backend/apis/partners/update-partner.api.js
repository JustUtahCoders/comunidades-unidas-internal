const mysql = require("mysql");
const {
  app,
  pool,
  invalidRequest,
  databaseError,
  insufficientPrivileges,
  notFound,
} = require("../../server");
const {
  checkValid,
  validId,
  nullableNonEmptyString,
  nullableValidBoolean,
} = require("../utils/validation-utils");
const fs = require("fs");
const path = require("path");
const { checkUserRole } = require("../utils/auth-utils");
const { getPartner } = require("./create-partner.api");

const updateSql = fs.readFileSync(
  path.resolve(__dirname, "./update-partner.sql"),
  "utf-8"
);

app.patch("/api/partners/:partnerId", (req, res) => {
  const authError = checkUserRole(req, "Administrator");

  if (authError) {
    return insufficientPrivileges(authError);
  }

  const partnerId = req.params.partnerId;

  const validationErrors = [
    ...checkValid(req.params, validId("partnerId")),
    ...checkValid(
      req.body,
      nullableNonEmptyString("name"),
      nullableValidBoolean("isActive")
    ),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  getPartner({ id: partnerId, includeInactive: true }, (err, partner) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (partner === 404) {
      return notFound(res, `No partner found with id ${partnerId}`);
    }

    const finalPartner = {
      ...partner,
      name: req.body.hasOwnProperty("name") ? req.body.name : partner.name,
      isActive: req.body.hasOwnProperty("isActive")
        ? req.body.isActive
        : partner.isActive,
    };

    const updateQuery = mysql.format(updateSql, [
      finalPartner.name,
      finalPartner.isActive,
      finalPartner.id,
    ]);

    pool.query(updateQuery, (err, result) => {
      if (err) {
        return databaseError(req, res, err);
      }

      res.send(finalPartner);
    });
  });
});
