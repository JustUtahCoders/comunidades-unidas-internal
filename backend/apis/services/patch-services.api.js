const {
  app,
  databaseError,
  pool,
  invalidRequest,
  insufficientPrivileges,
} = require("../../server");
const mariadb = require("mariadb/callback.js");
const {
  checkValid,
  validId,
  nullableNonEmptyString,
  nullableValidId,
  nullableValidBoolean,
  nullableValidCurrency,
  nullableValidEnum,
  nullableValidTime,
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
      nullableValidBoolean("isActive"),
      nullableNonEmptyString("defaultLineItemName"),
      nullableNonEmptyString("defaultLineItemDescription"),
      nullableValidCurrency("defaultLineItemRate"),
      nullableValidEnum(
        "defaultInteractionLocation",
        "CUOffice",
        "consulateOffice",
        "communityEvent"
      ),
      nullableValidEnum(
        "defaultInteractionType",
        "inPerson",
        "byPhone",
        "workshopTalk",
        "oneOnOneLightTouch",
        "consultation"
      ),
      nullableValidTime("defaultInteractionDuration")
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
      "isActive",
      "defaultLineItemName",
      "defaultLineItemDescription",
      "defaultLineItemRate",
      "defaultInteractionLocation",
      "defaultInteractionType",
      "defaultInteractionDuration"
    )
  ) {
    return invalidRequest(
      res,
      `PATCH /api/services/:serviceId must be called with a request body that has a serviceName, serviceDescription, programId, isActive, defaultLineItemName, defaultLineItemDescription, defaultLineItemRate, defaultInteractionLocation, defaultInteractionType, defaultInteractionDuration`
    );
  }

  const verifyValid = mariadb.format(
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
      defaultLineItemName:
        req.body.defaultLineItemName || service.defaultLineItemName,
      defaultLineItemDescription:
        req.body.defaultLineItemDescription ||
        service.defaultLineItemDescription,
      defaultLineItemRate:
        req.body.defaultLineItemRate || service.defaultLineItemRate,
      defaultInteractionType:
        req.body.defaultInteractionType || service.defaultInteractionType,
      defaultInteractionLocation:
        req.body.defaultInteractionLocation ||
        service.defaultInteractionLocation,
      defaultInteractionDuration:
        req.body.defaultInteractionDuration ||
        service.defaultInteractionDuration,
      isActive: req.body.hasOwnProperty("isActive")
        ? req.body.isActive
        : Boolean(service.isActive),
    };

    const updateService = mariadb.format(
      `
      UPDATE services
      SET serviceName = ?, serviceDesc = ?, programId = ?, isActive = ?, defaultLineItemName = ?,
        defaultLineItemDescription = ?, defaultLineItemRate = ?, defaultInteractionType = ?, defaultInteractionLocation = ?,
        defaultInteractionDuration = ?
      WHERE id = ?
      ;
      `,
      [
        finalService.serviceName,
        finalService.serviceDescription,
        finalService.programId,
        finalService.isActive,
        finalService.defaultLineItemName,
        finalService.defaultLineItemDescription,
        finalService.defaultLineItemRate,
        finalService.defaultInteractionType,
        finalService.defaultInteractionLocation,
        finalService.defaultInteractionDuration,
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
