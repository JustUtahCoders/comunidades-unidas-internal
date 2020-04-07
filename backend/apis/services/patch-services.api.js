const {
  app,
  databaseError,
  pool,
  invalidRequest,
  insufficientPrivileges,
} = require("../../server");
const mysql = require("mysql");
const {
  checkValid,
  validId,
  nullableNonEmptyString,
  nullableValidId,
  nullableValidBoolean,
} = require("../utils/validation-utils");
const { checkUserRole } = require("../utils/auth-utils");
const { atLeastOne } = require("../utils/patch-utils");

app.patch("/api/services/:serviceId", (req, res, next) => {
  const authError = checkUserRole(req, "Administrator");

  if (authError) {
    return insufficientPrivileges(res, authError);
  }

  const validationErrors = [
    ...checkValid(req.params, validId("serviceId")),
    ...checkValid(
      req.body,
      nullableNonEmptyString("serviceName"),
      nullableNonEmptyString("serviceDescription"),
      nullableValidId("programId"),
      nullableValidBoolean("isActive")
    ),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  if (
    !atLeastOne(
      req.body,
      "serviceName",
      "serviceDescription",
      "programId",
      "isActive"
    )
  ) {
    return invalidRequest(
      res,
      `PATCH /api/services/:serviceId must be called with a request body that has a serviceName, serviceDescription, programId, and/or isActive`
    );
  }

  const verifyValid = mysql.format(
    `
    SELECT * FROM services WHERE id = ?;
    ${req.body.programId ? "SELECT * FROM programs WHERE id = ?" : ""}
    `,
    [req.params.serviceId, req.body.programId]
  );

  pool.query(verifyValid, (err, result) => {
    if (err) {
      return databaseError(err);
    }

    let serviceResult, programResult;
    if (req.body.programId) {
      serviceResult = result[0];
      programResult = result[1];
    } else {
      serviceResult = result;
      programResult = [];
    }

    if (serviceResult.length === 0) {
      return invalidRequest(
        res,
        `No service exists with id '${req.params.serviceId}'`
      );
    }

    if (req.body.programId && programResult.length === 0) {
      return invalidRequest(
        res,
        `No program exists with id '${req.body.programId}'`
      );
    }

    const service = serviceResult[0];

    const finalService = {
      id: service.id,
      serviceName: req.body.serviceName || service.serviceName,
      serviceDescription: req.body.serviceDescription || service.serviceDesc,
      programId: req.body.programId || service.programId,
      isActive: req.body.hasOwnProperty("isActive")
        ? req.body.isActive
        : Boolean(service.isActive),
    };

    const updateService = mysql.format(
      `
      UPDATE services
      SET serviceName = ?, serviceDesc = ?, programId = ?, isActive = ?
      WHERE id = ?
      ;
      `,
      [
        finalService.serviceName,
        finalService.serviceDescription,
        finalService.programId,
        finalService.isActive,
        req.params.serviceId,
      ]
    );

    pool.query(updateService, (err, result) => {
      if (err) {
        return databaseError(req, res, err);
      }

      res.send({
        service: finalService,
      });
    });
  });
});
