const { app, databaseError, pool, invalidRequest } = require("../../../server");
const mariadb = require("mariadb");
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
const getFollowUpSql = fs.readFileSync(
  path.resolve(__dirname, "./get-follow-up.sql"),
  "utf-8"
);
const { insertActivityLogQuery } = require("../client-logs/activity-log.utils");

app.post("/api/clients/:clientId/follow-ups", (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.params, validId("clientId")),
    ...checkValid(req.body, validArray("serviceIds", validId)),
    ...checkValid(req.body, validDateTime("dateOfContact")),
    ...checkValid(req.body, validTime("duration")),
    ...checkValid(req.body, nullableValidDateTime("appointmenetDate")),
  ];

  let { clientId } = req.params;

  clientId = Number(clientId);

  const {
    serviceIds,
    title,
    description,
    dateOfContact,
    appointmentDate,
    duration,
  } = req.body;

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const insertFollowUpSql = mariadb.format(followUpsSql, [
    clientId,
    title,
    description,
    dateOfContact,
    appointmentDate,
    duration,
    user.id,
    user.id,
  ]);

  pool.query(insertFollowUpSql, (err, insertResult) => {
    if (err) {
      return databaseError(req, res, err);
    }

    let query = "";

    serviceIds.forEach((id) => {
      query += mariadb.format(
        `INSERT INTO followUpServices (serviceId, followUpId) VALUES (?, ?);
        `,
        [id, insertResult.insertId]
      );
    });

    query += mariadb.format(
      `SELECT GROUP_CONCAT(services.serviceName SEPARATOR ', ') services FROM services WHERE id IN (?);`,
      [serviceIds.length > 0 ? serviceIds : null]
    );

    pool.query(query, (err, joinResult) => {
      if (err) {
        return databaseError(req, res, err);
      }

      let title = `Client received follow-up`;

      if (serviceIds.length > 0) {
        title += ` regarding ${
          joinResult[joinResult.length - 1][0]["services"]
        }`;
      }

      const query = insertActivityLogQuery({
        detailId: insertResult.insertId,
        clientId,
        title,
        description: null,
        logType: "follow-up",
        addedBy: user.id,
        dateAdded: dateOfContact,
      });

      pool.query(query, (err, logResult) => {
        if (err) {
          return databaseError(req, res, err);
        }

        formattedFollowUpResponse(insertResult.insertId, (err, result) => {
          if (err) {
            return databaseError(err);
          }
          res.send(result);
        });
      });
    });
  });
});

function formattedFollowUpResponse(id, errBack) {
  const query = mariadb.format(getFollowUpSql, [id, id]);
  pool.query(query, (err, followUpResult) => {
    if (err) {
      return errBack(err, null);
    } else {
      let formattedResult = { ...followUpResult[0] };
      formattedResult.serviceIds = JSON.parse(formattedResult.serviceIds);
      formattedResult.createdBy = JSON.parse(formattedResult.createdBy);
      formattedResult.lastUpdatedBy = JSON.parse(formattedResult.lastUpdatedBy);
      errBack(null, formattedResult);
    }
  });
}
