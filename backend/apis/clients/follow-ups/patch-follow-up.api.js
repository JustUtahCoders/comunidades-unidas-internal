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

app.patch("/api/clients/:clientId/follow-ups/:followUpId", (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.params, validId("clientId"), validId("followUpId")),
    ...checkValid(req.body, validArray("serviceIds", validId)),
    ...checkValid(req.body, validDateTime("dateOfContact")),
    ...checkValid(req.body, nullableValidDateTime("appointmenetDate")),
  ];

  const { clientId, followUpId } = req.params;

  const {
    serviceIds,
    title,
    description,
    dateOfContact,
    appointmentDate,
  } = req.body;

  const getFollowUpByIdSql = mysql.format(getFollowUpSql, [
    followUpId,
    followUpId,
  ]);

  pool.query(getFollowUpByIdSql, (err, followUpResult) => {
    if (err) {
      databaseError(req, res, err);
    }

    const getCurrentUserSql = mysql.format(
      'SELECT JSON_OBJECT("userId", users.id, "firstName", users.firstName, "lastName", users.lastName) lastUpdatedBy FROM users WHERE id = ?;',
      [user.id]
    );

    const newFollowUpInfo = { ...req.body };
    const newFollowUp = Object.assign({}, followUpResult[0], newFollowUpInfo);
    console.log(newFollowUp);
    let updateFollowUpSql = mysql.format(
      `UPDATE followUps SET
          title = ?,
          description = ?,
          dateOfContact = ?,
          appointmentDate = ?,
          updatedBy = ?
        WHERE id = ?;
      `,
      [
        newFollowUp.title,
        newFollowUp.description,
        newFollowUp.dateOfContact,
        newFollowUp.appointmentDate,
        user.id,
        newFollowUp.id,
      ]
    );
    const oldServiceIds = JSON.parse(followUpResult[0].serviceIds);
    updateFollowUpSql =
      mysql.format("DELETE FROM followUpServices WHERE followUpId = ?;", [
        newFollowUp.id,
      ]) + updateFollowUpSql;
    newFollowUp.serviceIds.forEach((id) => {
      updateFollowUpSql += mysql.format(
        "INSERT INTO followUpServices (serviceId, followUpId) VALUES (?, ?);",
        [id, newFollowUp.id]
      );
    });
    pool.query(updateFollowUpSql, (err, updateResult) => {
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
