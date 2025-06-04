const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound,
} = require("../../../server");
const mariadb = require("mariadb/callback.js");
const {
  checkValid,
  validId,
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
const { formatFollowUpRow } = require("./get-follow-up.api");

app.patch("/api/clients/:clientId/follow-ups/:followUpId", (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.params, validId("clientId"), validId("followUpId")),
    ...checkValid(req.body, validArray("serviceIds", validId)),
    ...checkValid(req.body, validDateTime("dateOfContact")),
    ...checkValid(req.body, nullableValidDateTime("appointmentDate")),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  let { clientId, followUpId } = req.params;

  clientId = Number(clientId);
  followUpId = Number(followUpId);

  const { serviceIds } = req.body;

  const getFollowUpByIdSql = mariadb.format(getFollowUpSql, [
    followUpId,
    followUpId,
  ]);

  pool.query(getFollowUpByIdSql, (err, followUpResult) => {
    if (err) {
      databaseError(req, res, err);
    }

    const newFollowUpInfo = { ...req.body };
    const newFollowUp = Object.assign({}, followUpResult[0], newFollowUpInfo);

    let updateFollowUpSql = mariadb.format(
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

    updateFollowUpSql =
      mariadb.format(`DELETE FROM followUpServices WHERE followUpId = ?;`, [
        newFollowUp.id,
      ]) + updateFollowUpSql;

    newFollowUp.serviceIds.forEach((id) => {
      updateFollowUpSql += mariadb.format(
        `INSERT INTO followUpServices (serviceId, followUpId) VALUES (?, ?);
        `,
        [id, newFollowUp.id]
      );
    });

    updateFollowUpSql += mariadb.format(
      `SELECT GROUP_CONCAT(services.serviceName SEPARATOR ', ') services FROM services WHERE id IN (?);`,
      [serviceIds.length > 0 ? serviceIds : null]
    );

    pool.query(updateFollowUpSql, (err, updateResult) => {
      if (err) {
        return databaseError(req, res, err);
      }

      let title = `Client received follow up`;
      if (serviceIds.length > 0) {
        title += ` regarding ${
          updateResult[updateResult.length - 1][0]["services"]
        }`;
      }

      let clientLogUpdate = insertActivityLogQuery({
        detailId: newFollowUp.id,
        clientId,
        title,
        description: null,
        logType: "follow-up",
        addedBy: user.id,
        dateAdded: newFollowUp.dateOfContact,
      });

      clientLogUpdate += mariadb.format(
        `
        UPDATE clientLogs
        SET idOfUpdatedLog = @logId
        WHERE detailId = ? AND id <> @logId
      `,
        [newFollowUp.id, newFollowUp.id]
      );

      pool.query(clientLogUpdate, (err, clientLogResult) => {
        if (err) {
          return databaseError(req, res, err);
        }

        pool.query(getFollowUpByIdSql, (err, result) => {
          if (err) {
            return databaseError(req, res, err);
          }

          const row = result[0];

          if (!row.id) {
            return notFound(res, `No follow up found with id ${followUpId}`);
          }

          if (row.clientId !== clientId) {
            return notFound(
              res,
              `Follow up with id ${followUpId} does not belong to client ${clientId}`
            );
          }

          res.send(formatFollowUpRow(row));
        });
      });
    });
  });
});
