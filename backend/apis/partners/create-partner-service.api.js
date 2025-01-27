const mysql = require("mysql2");
const { app, pool, invalidRequest, notFound } = require("../../server");
const { checkUserRole } = require("../utils/auth-utils");
const {
  checkValid,
  nonEmptyString,
  validBoolean,
  validId,
} = require("../utils/validation-utils");
const fs = require("fs");
const path = require("path");
const { getPartner } = require("./create-partner.api");

const insertSql = fs.readFileSync(
  path.resolve(__dirname, "./create-partner-service.sql")
);
const getSql = fs.readFileSync(
  path.resolve(__dirname, "./get-partner-service.sql")
);

app.post("/api/partners/:partnerId/services", (req, res) => {
  const authError = checkUserRole(req, "Administrator");

  if (authError) {
    return insufficientPrivileges(res, authError);
  }

  const validationErrors = [
    ...checkValid(req.body, nonEmptyString("name"), validBoolean("isActive")),
    ...checkValid(req.params, validId("partnerId")),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const user = req.session.passport.user;
  const partnerId = Number(req.params.partnerId);

  getPartner({ id: partnerId, includeInactive: true }, (err, partner) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (partner === 404) {
      return notFound(res, `No such partner ${partnerId}`);
    }

    const query = mysql.format(insertSql, [
      partnerId,
      req.body.name,
      req.body.isActive,
      user.id,
      user.id,
    ]);

    pool.query(query, (err, result) => {
      if (err) {
        return databaseError(req, res, err);
      }

      getPartnerService({ id: result.insertId }, (err, partnerService) => {
        if (err) {
          return databaseError(req, res, err);
        }

        res.send(partnerService);
      });
    });
  });
});

function getPartnerService({ id, includeInactive = false }, errBack) {
  const query = mysql.format(getSql, [id, true, !includeInactive]);
  pool.query(query, (err, result) => {
    if (err) {
      return errBack(err, null);
    } else if (result.length === 0) {
      errBack(null, 404);
    } else {
      const service = result[0];
      errBack(null, {
        id: service.id,
        name: service.name,
        partnerId: service.partnerId,
        isActive: Boolean(service.isActive),
        dateAdded: service.dateAdded,
        addedBy: service.addedBy,
        dateModified: service.dateModified,
        modifiedBy: service.modifiedBy,
      });
    }
  });
}

exports.getPartnerService = getPartnerService;
