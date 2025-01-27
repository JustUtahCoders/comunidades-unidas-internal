const mysql = require("mysql2");
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
const { getPartnerService } = require("./create-partner-service.api");

const updateSql = fs.readFileSync(
  path.resolve(__dirname, "./update-partner-service.sql"),
  "utf-8"
);

app.patch("/api/partners/:partnerId/services/:serviceId", (req, res) => {
  const authError = checkUserRole(req, "Administrator");

  if (authError) {
    return insufficientPrivileges(authError);
  }

  const validationErrors = [
    ...checkValid(req.params, validId("partnerId"), validId("serviceId")),
    ...checkValid(
      req.body,
      nullableNonEmptyString("name"),
      nullableValidBoolean("isActive")
    ),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const partnerServiceId = Number(req.params.serviceId);

  getPartnerService(
    { id: partnerServiceId, includeInactive: true },
    (err, partnerService) => {
      if (err) {
        return databaseError(req, res, err);
      }

      if (partnerService === 404) {
        return notFound(
          res,
          `No partner service found with id ${partnerServiceId}`
        );
      }

      const finalPartnerService = {
        ...partnerService,
        name: req.body.hasOwnProperty("name")
          ? req.body.name
          : partnerService.name,
        isActive: req.body.hasOwnProperty("isActive")
          ? req.body.isActive
          : partnerService.isActive,
      };

      const updateQuery = mysql.format(updateSql, [
        finalPartnerService.name,
        finalPartnerService.isActive,
        finalPartnerService.id,
      ]);

      pool.query(updateQuery, (err, result) => {
        if (err) {
          return databaseError(req, res, err);
        }

        res.send(finalPartnerService);
      });
    }
  );
});
