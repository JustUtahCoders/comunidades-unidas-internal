const { app, databaseError, pool } = require("../../server");
const mysql = require("mysql");
const {
  responseDateWithoutTime,
  requestEnum,
  requestPhone
} = require("../utils/transform-utils");
const {
  nullableValidDate,
  checkValid,
  nullableNonEmptyString,
  nonEmptyString,
  validDate,
  validPhone,
  validBoolean,
  validState,
  validZip,
  validEmail,
  nullableValidEnum,
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
      nullableValidDate("dateOfUSArrival"),
      nonEmptyString("homeLanguage"),
      validEnum("currentlyEmployed", "yes", "no", "n/a", "unknown"),
      nullableNonEmptyString("employmentSector"),
      nullableValidEnum(
        "payInterval",
        "every-week",
        "every-two-weeks",
        "every-month",
        "every-quarter",
        "every-year"
      ),
      nullableValidEnum("weeklyEmployedHours", "0-20", "21-35", "36-40", "41+"),
      validInteger("householdIncome"),
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

    connection.beginTransaction(err => {
      if (err) {
        return databaseError(req, ers, err, connection);
      }

      const insertClient = mysql.format(
        `
        INSERT INTO clients
        (
          firstName,
          lastName,
          birthday,
          gender,
          addedBy,
          modifiedBy
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
        [
          req.body.firstName,
          req.body.lastName,
          req.body.birthday,
          req.body.gender,
          req.session.passport.user.id,
          req.session.passport.user.id
        ]
      );

      console.log("insertClient", insertClient);

      connection.query(insertClient, (insertClientErr, result, fields) => {
        if (insertClientErr) {
          connection.rollback();
          return databaseError(req, res, insertClientErr, connection);
        }

        const clientId = result.insertId;

        const contactInfoValues = [
          clientId,
          req.body.phone,
          req.body.smsConsent,
          req.body.email,
          req.body.homeAddress.street,
          req.body.homeAddress.city,
          req.body.homeAddress.state,
          req.body.homeAddress.zip,
          requestEnum(req.body.housingStatus),
          req.session.passport.user.id
        ];

        const demographicsValues = [
          clientId,
          req.body.countryOfOrigin.toUpperCase(),
          requestEnum(req.body.homeLanguage),
          req.body.englishProficiency,
          req.body.dateOfUSArrival,
          requestEnum(req.body.currentlyEmployed),
          req.body.employmentSector,
          req.body.payInterval,
          req.body.weeklyEmployedHours,
          req.body.householdSize,
          req.body.dependents,
          req.body.civilStatus,
          req.body.householdIncome,
          req.session.passport.user.id
        ];

        const insertOther = mysql.format(
          `
          INSERT INTO contactInformation (
            clientId,
            primaryPhone,
            textMessages,
            email,
            address,
            city,
            state,
            zip,
            housingStatus,
            addedBy
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

          INSERT INTO demographics (
            clientId,
            countryOfOrigin,
            homeLanguage,
            englishProficiency,
            dateOfUSArrival,
            employed,
            employmentSector,
            payInterval,
            weeklyAvgHoursWorked,
            householdSize,
            dependents,
            civilStatus,
            householdIncome,
            addedBy
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `,
          [...contactInfoValues, ...demographicsValues]
        );

        console.log("otherQuery", insertOther);

        connection.query(insertOther, (err, result, fields) => {
          if (err) {
            connection.rollback();
            return databaseError(req, res, err, connection);
          }

          connection.commit();
          res.send({
            success: true
          });
        });
      });
    });

    // connection.query(insertQuery, (err, insertResult) => {
    //   if (err) {
    //     return databaseError(req, res, err, connection);
    //   }

    //   const selectQuery = mysql.format(
    //     `
    //     SELECT
    //       clients.id, clients.dateOfIntake, clients.firstName, clients.lastName, clients.birthday, clients.gender, clients.phone,
    //       clients.smsConsent, clients.homeStreet, clients.homeCity, clients.homeState, clients.homeZip, clients.email, clients.civilStatus,
    //       clients.countryOfOrigin, clients.dateOfUSArrival, clients.homeLanguage, clients.currentlyEmployed, clients.employmentSector,
    //       clients.householdIncome, clients.householdSize, clients.isStudent, clients.eligibleToVote, clients.clientSource, clients.couldVolunteer,
    //       clients.dateAdded, clients.dateModified,
    //       created.id as createdById, created.firstName as createdByFirstName, created.lastName as createdByLastName,
    //       updated.id as updatedById, updated.firstName as updatedByFirstName, updated.lastName as updatedByLastName
    //     FROM
    //       clients
    //       JOIN
    //         users AS created
    //       JOIN
    //         users AS updated
    //     WHERE
    //       clients.id = ? AND created.id = clients.addedBy AND updated.id = clients.modifiedBy
    //   `,
    //     [insertResult.insertId]
    //   );

    //   connection.query(selectQuery, (err, rows) => {
    //     if (err) {
    //       return databaseError(req, res, err, connection);
    //     }

    //     const row = rows[0];

    //     res.send({
    //       id: row.id,
    //       createdBy: {
    //         userId: row.createdById,
    //         firstName: row.createdByFirstName,
    //         lastName: row.createdByLastName,
    //         fullName:
    //           (row.createdByFirstName || "") +
    //           " " +
    //           (row.createdByLastName || ""),
    //         timestamp: row.dateAdded
    //       },
    //       lastUpdatedBy: {
    //         userId: row.createdById,
    //         firstName: row.createdByFirstName,
    //         lastName: row.createdByLastName,
    //         fullName:
    //           (row.createdByFirstName || "") +
    //           " " +
    //           (row.createdByLastName || ""),
    //         timestamp: row.dateModified
    //       },
    //       dateOfIntake: responseDateWithoutTime(row.dateOfIntake),
    //       firstName: row.firstName,
    //       lastName: row.lastName,
    //       birthday: responseDateWithoutTime(row.birthday),
    //       gender: row.gender,
    //       phone: row.phone,
    //       smsConsent: Boolean(row.smsConsent),
    //       homeAddress: {
    //         street: row.homeStreet,
    //         city: row.homeCity,
    //         state: row.homeState,
    //         zip: row.zip
    //       },
    //       email: row.email,
    //       civilStatus: row.civilStatus,
    //       countryOfOrigin: row.countryOfOrigin,
    //       dateOfUSArrival: responseDateWithoutTime(row.dateOfUSArrival),
    //       homeLanguage: row.primaryLanguage,
    //       currentlyEmployed: Boolean(row.currentlyEmployed),
    //       employmentSector: row.employmentSector,
    //       householdIncome: row.householdIncome,
    //       householdSize: row.householdSize,
    //       isStudent: Boolean(row.isStudent),
    //       eligibleToVote: Boolean(row.eligibleToVote),
    //       clientSource: row.clientSource,
    //       couldVolunteer: Boolean(row.couldVolunteer)
    //     });
    //   });
    // });
  });
});
