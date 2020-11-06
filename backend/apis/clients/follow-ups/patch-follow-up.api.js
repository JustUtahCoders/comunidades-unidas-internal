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

  // validations here

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
    const getCurrentUserSql = `SELECT JSON_OBJECT("userId", users.id, "firstName", users.firstName, "lastName", users.lastName) lastUpdatedBy FROM users WHERE id = ${user.id}`;
    pool.query(getCurrentUserSql, (err, userResult) => {
      if (err) {
        return databaseError(req, res, err);
      }
      const newFollowUpInfo = { ...req.body, ...userResult[0] };
      const newFollowUp = Object.assign({}, followUpResult[0], newFollowUpInfo);
      const updateFollowUpSql = mysql.format(
        `UPDATE followUps SET
          title = ?,
          description = ?,
          dateOfContact = ?,
          appointmentDate = ?,
          updatedBy = ?
        WHERE id = ?
      `,
        [
          newFollowUp.title,
          newFollowUp.description,
          newFollowUp.dateOfContact,
          newFollowUp.appointmentDate,
          newFollowUp.lastUpdatedBy,
          newFollowUp.id,
        ]
      );

      pool.query(updateFollowUpSql, (err, updateResult) => {
        if (err) {
          return databaseError(req, res, err);
        }
        console.log(updateResult);
        // foreign keys constraints can turn off check, delete from join table at fu id and then add new/updated ones too?
      });
    });
  });

  res.send("hit");
});
