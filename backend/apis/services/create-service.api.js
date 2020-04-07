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
  nonEmptyString,
  nullableValidBoolean,
} = require("../utils/validation-utils");
const { checkUserRole } = require("../utils/auth-utils");

app.post("/api/services", (req, res, next) => {
  const authError = checkUserRole(req, "Administrator");

  if (authError) {
    return insufficientPrivileges(res, authError);
  }

  const validationErrors = checkValid(
    req.body,
    nonEmptyString("serviceName"),
    nonEmptyString("serviceDescription"),
    validId("programId"),
    nullableValidBoolean("isActive")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const verifyValid = mysql.format(
    `
    SELECT * FROM programs WHERE id = ?
    ;
    `,
    [req.body.programId]
  );

  pool.query(verifyValid, (err, result) => {
    if (err) {
      return databaseError(err);
    }

    if (result.length === 0) {
      return invalidRequest(
        res,
        `There is no program with id '${req.body.programId}'`
      );
    }

    const finalService = {
      serviceName: req.body.serviceName,
      serviceDescription: req.body.serviceDescription,
      programId: req.body.programId,
      isActive: req.body.hasOwnProperty("isActive") ? req.body.isActive : true,
    };

    const updateService = mysql.format(
      `
      INSERT INTO services (serviceName, serviceDesc, programId, isActive)
      VALUES (?, ?, ?, ?);

      SELECT LAST_INSERT_ID() id;
      ;
      `,
      [
        finalService.serviceName,
        finalService.serviceDescription,
        finalService.programId,
        finalService.isActive,
      ]
    );

    pool.query(updateService, (err, result) => {
      if (err) {
        return databaseError(req, res, err);
      }

      const [insertResult, lastInsertId] = result;

      finalService.id = lastInsertId[0].id;
      res.send({
        service: finalService,
      });
    });
  });
});
