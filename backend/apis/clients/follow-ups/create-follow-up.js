const { app, databaseError, pool, invalidRequest } = require("../../../server");
const mysql = require("mysql");
const {
  checkValid,
  validId,
  validDate,
  validTime,
  validArray,
} = require("../../utils/validation-utils");

app.post("/api/clients/:clientId/follow-ups", (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.params, validId("clientId")),
    ...checkValid(req.params, validArray("serviceIds")),
    // incomplete
  ];

  const {
    serviceIds,
    title,
    description,
    dateOfContact,
    appointmentDate,
  } = req.body;

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  pool.query(serviceSql, (err, serviceResult) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (serviceResult.length !== 1) {
      return invalidRequest(
        res,
        `No CU service exists with id '${req.body.serviceId}'`
      );
    }

    const serviceName = serviceResult[0].serviceName;

    const insertFollowUpSql = mysql.format(`INSERT INTO followUps ()`);
  });

  const insertServicesAndFollowUpQuery = mysql.format(
    `INSERT INTO followUpServices WHERE`
  );
});
