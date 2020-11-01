const { app, databaseError, pool, invalidRequest } = require("../../../server");
const mysql = require("mysql");
const {
  checkValid,
  validId,
  validDate,
  validTime,
  validArray,
  validDateTime,
  nullableValidDateTime,
} = require("../../utils/validation-utils");
const fs = require("fs");
const path = require("path");
const followUpsSql = fs.readFileSync(
  path.resolve(__dirname, "./create-follow-up.sql"),
  "utf-8"
);

app.post("/api/clients/:clientId/follow-ups", (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.params, validId("clientId")),
    ...checkValid(req.body, validArray("serviceIds", validId)),
    ...checkValid(req.body, validDateTime("dateOfContact")),
    ...checkValid(req.body, nullableValidDateTime("appointmenetDate")),
  ];

  const { clientId } = req.params;

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

  // addedByUser ===> use user variable to query and get user (see if there is already a util function for that)
  // updatedByUser ===> should be same user as above
  const addedByUser = null;

  // const insertFollowUpSql = mysql.format(followUpsSql, [
  //   clientId,
  //   title,
  //   description,
  //   dateOfContact,
  //   appointmentDate,
  //   addedByUser,
  //   addedByUser,
  // ]);

  // pool.query(insertFollowUpSql, (err, serviceResult) => {
  //   if (err) {
  //     return databaseError(req, res, err);
  //   }

  //   if (serviceResult.length !== 1) {
  //     return invalidRequest(
  //       res,
  //       `No CU service exists with id '${req.body.serviceId}'`
  //     );
  //   }

  //   const serviceName = serviceResult[0].serviceName;

  //   // const insertFollowUpSql = mysql.format(`INSERT INTO followUps ()`);
  // });

  // const insertServicesAndFollowUpQuery = mysql.format(
  //   `INSERT INTO followUpServices WHERE`
  // );
  res.send("hi");
});
