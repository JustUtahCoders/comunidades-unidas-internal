const { app, databaseError, pool } = require("../../server");
const mysql = require("mysql");
const { dateWithoutTime } = require("../utils/transform-utils");
const {
  checkValid,
  nonEmptyString,
  validDate,
  validPhone,
  validBoolean,
  validState,
  validZip,
  validEmail,
  validEnum,
  validCountry,
  validInteger
} = require("../utils/validation-utils");

app.post("/api/clients", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err, connection);
    }

    const validityErrors = checkValid(
      req.body,
      nonEmptyString("firstName"),
      nonEmptyString("lastName"),
      validDate("birthday"),
      nonEmptyString("gender"),
      validDate("dateOfIntake"),
      validPhone("phone"),
      validBoolean("smsConsent"),
      nonEmptyString("homeAddress.street"),
      nonEmptyString("homeAddress.city"),
      validState("homeAddress.state"),
      validZip("homeAddress.zip"),
      validEmail("email"),
      validEnum(
        "civilStatus",
        "single",
        "married",
        "commonLawMarriage",
        "divorced",
        "widowed"
      ),
      validCountry("countryOfOrigin"),
      validDate("dateOfUSArrival"),
      nonEmptyString("primaryLanguage"),
      validBoolean("currentlyEmployed"),
      nonEmptyString("employmentSector"),
      validInteger("annualIncome"),
      validInteger("householdSize"),
      validBoolean("isStudent"),
      validEnum(
        "clientSource",
        "facebook",
        "instagram",
        "website",
        "promotionalMaterial",
        "consulate",
        "friend",
        "previousClient",
        "employee",
        "sms",
        "radio",
        "tv",
        "other"
      ),
      validBoolean("couldVolunteer")
    );

    if (validityErrors.length > 0) {
      res.status(400).send({
        validationErrors: validityErrors
      });
      return;
    }

    const insertValues = [
      req.body.firstName,
      req.body.lastName,
      req.body.birthday,
      req.body.gender,
      req.body.dateOfIntake,
      req.body.phone,
      req.body.smsConsent,
      req.body.homeAddress.street,
      req.body.homeAddress.city,
      req.body.homeAddress.state,
      req.body.homeAddress.zip,
      req.body.email,
      req.body.civilStatus,
      req.body.countryOfOrigin,
      req.body.dateOfUSArrival,
      req.body.primaryLanguage,
      req.body.currentlyEmployed,
      req.body.employmentSector,
      req.body.annualIncome,
      req.body.householdSize,
      req.body.isStudent,
      req.body.eligibleToVote,
      req.body.clientSource,
      req.body.couldVolunteer,
      req.session.passport.user.id,
      req.session.passport.user.id
    ];

    const insertQuery = mysql.format(
      `
    INSERT INTO clients
    (
      firstName,
      lastName,
      birthday,
      gender,
      dateOfIntake,
      phone,
      smsConsent,
      homeStreet,
      homeCity,
      homeState,
      homeZip,
      email,
      civilStatus,
      countryOfOrigin,
      dateOfUSArrival,
      primaryLanguage,
      currentlyEmployed,
      employmentSector,
      annualIncome,
      householdSize,
      isStudent,
      eligibleToVote,
      clientSource,
      couldVolunteer,
      addedBy,
      modifiedBy
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      insertValues
    );

    connection.query(insertQuery, (err, insertResult) => {
      if (err) {
        return databaseError(req, res, err, connection);
      }

      const selectQuery = mysql.format(
        `
        SELECT
          clients.id, clients.dateOfIntake, clients.firstName, clients.lastName, clients.birthday, clients.gender, clients.phone,
          clients.smsConsent, clients.homeStreet, clients.homeCity, clients.homeState, clients.homeZip, clients.email, clients.civilStatus,
          clients.countryOfOrigin, clients.dateOfUSArrival, clients.primaryLanguage, clients.currentlyEmployed, clients.employmentSector,
          clients.annualIncome, clients.householdSize, clients.isStudent, clients.eligibleToVote, clients.clientSource, clients.couldVolunteer,
          clients.dateAdded, clients.dateModified,
          created.id as createdById, created.firstName as createdByFirstName, created.lastName as createdByLastName,
          updated.id as updatedById, updated.firstName as updatedByFirstName, updated.lastName as updatedByLastName
        FROM
          clients
          JOIN
            users AS created
          JOIN
            users AS updated
        WHERE
          clients.id = ? AND created.id = clients.addedBy AND updated.id = clients.modifiedBy
      `,
        [insertResult.insertId]
      );

      connection.query(selectQuery, (err, rows) => {
        if (err) {
          return databaseError(req, res, err, connection);
        }

        const row = rows[0];

        res.send({
          id: row.id,
          createdBy: {
            userId: row.createdById,
            firstName: row.createdByFirstName,
            lastName: row.createdByLastName,
            fullName:
              (row.createdByFirstName || "") +
              " " +
              (row.createdByLastName || ""),
            timestamp: row.dateAdded
          },
          lastUpdatedBy: {
            userId: row.createdById,
            firstName: row.createdByFirstName,
            lastName: row.createdByLastName,
            fullName:
              (row.createdByFirstName || "") +
              " " +
              (row.createdByLastName || ""),
            timestamp: row.dateModified
          },
          dateOfIntake: dateWithoutTime(row.dateOfIntake),
          firstName: row.firstName,
          lastName: row.lastName,
          birthday: dateWithoutTime(row.birthday),
          gender: row.gender,
          phone: row.phone,
          smsConsent: Boolean(row.smsConsent),
          homeAddress: {
            street: row.homeStreet,
            city: row.homeCity,
            state: row.homeState,
            zip: row.zip
          },
          email: row.email,
          civilStatus: row.civilStatus,
          countryOfOrigin: row.countryOfOrigin,
          dateOfUSArrival: dateWithoutTime(row.dateOfUSArrival),
          primaryLanguage: row.primaryLanguage,
          currentlyEmployed: Boolean(row.currentlyEmployed),
          employmentSector: row.employmentSector,
          annualIncome: row.annualIncome,
          householdSize: row.householdSize,
          isStudent: Boolean(row.isStudent),
          eligibleToVote: Boolean(row.eligibleToVote),
          clientSource: row.clientSource,
          couldVolunteer: Boolean(row.couldVolunteer)
        });
      });
    });
  });
});
