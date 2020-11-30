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
const getFollowUpSql = fs.readFileSync(
  path.resolve(__dirname, "./get-follow-up.sql"),
  "utf-8"
);
const { insertActivityLogQuery } = require("../client-logs/activity-log.utils");

app.patch("/api/clients/:clientId/follow-ups/:followUpId", (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.params, validId("clientId"), validId("followUpId")),
    ...checkValid(req.body, validArray("serviceIds", validId)),
    ...checkValid(req.body, validDateTime("dateOfContact")),
    ...checkValid(req.body, nullableValidDateTime("appointmentDate")),
  ];

  const { clientId, followUpId } = req.params;

  const {
    serviceIds,
    title,
    description,
    dateOfContact,
    appointmentDate,
    duration,
  } = req.body;

  const getFollowUpByIdSql = mysql.format(getFollowUpSql, [
    followUpId,
    followUpId,
  ]);

  pool.query(getFollowUpByIdSql, (err, followUpResult) => {
    if (err) {
      databaseError(req, res, err);
    }

    const newFollowUpInfo = { ...req.body };
    const newFollowUp = Object.assign({}, followUpResult[0], newFollowUpInfo);

    let updateFollowUpSql = mysql.format(
      `UPDATE followUps SET
          title = ?,
          description = ?,
          dateOfContact = ?,
          appointmentDate = ?,
          duration = ?,
          updatedBy = ?
        WHERE id = ?;
      `,
      [
        newFollowUp.title,
        newFollowUp.description,
        newFollowUp.dateOfContact,
        newFollowUp.appointmentDate,
        newFollowUp.duration,
        user.id,
        newFollowUp.id,
      ]
    );

    const oldServiceIds = JSON.parse(followUpResult[0].serviceIds);

    updateFollowUpSql =
      mysql.format(`DELETE FROM followUpServices WHERE followUpId = ?;`, [
        newFollowUp.id,
      ]) + updateFollowUpSql;

    newFollowUp.serviceIds.forEach((id) => {
      updateFollowUpSql += mysql.format(
        `INSERT INTO followUpServices (serviceId, followUpId) VALUES (?, ?);
        `,
        [id, newFollowUp.id]
      );
    });

    updateFollowUpSql += mysql.format(
      `SELECT GROUP_CONCAT(services.serviceName SEPARATOR ', ') services FROM services WHERE id IN (?);`,
      [serviceIds]
    );

    pool.query(updateFollowUpSql, (err, updateResult) => {
      if (err) {
        return databaseError(req, res, err);
      }

      let clientLogUpdate = insertActivityLogQuery({
        detailId: newFollowUp.id,
        clientId,
        title: `Client received follow up regarding ${
          updateResult[updateResult.length - 1][0]["services"]
        }`,
        description: null,
        logType: "follow-up",
        addedBy: user.id,
      });

      clientLogUpdate += mysql.format(
        `
        WITH oldLog AS (
          SELECT id FROM clientLogs
          WHERE logType IN ("follow-up")
            AND detailId = ?
          ORDER BY dateAdded DESC
          LIMIT 1, 1
        )

        UPDATE clientLogs
        SET idOfUpdatedLog = LAST_INSERT_ID()
        WHERE id = (SELECT id FROM oldLog);
      `,
        [newFollowUp.id]
      );

      pool.query(clientLogUpdate, (err, clientLogResult) => {
        if (err) {
          return databaseError(req, res, err);
        }

        pool.query(getFollowUpByIdSql, (err, followUp) => {
          if (err) {
            return databaseError(req, res, err);
          }
          res.send(followUp);
        });
      });
    });
  });
});
