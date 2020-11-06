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
    console.log(followUpResult);
  });

  res.send("hit");
});
