const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");
const { requestEnum, requestPhone } = require("../utils/transform-utils");
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
  validArray,
  validInteger
} = require("../utils/validation-utils");
const { getClientById } = require("./get-client.api");
const { insertContactInformationQuery } = require("./insert-client.utils");

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
      validBoolean("couldVolunteer"),
      validArray("intakeServices", validInteger)
    );

    if (validityErrors.length > 0) {
      return invalidRequest(res, validityErrors);
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

      connection.query(insertClient, (insertClientErr, result, fields) => {
        if (insertClientErr) {
          connection.rollback();
          return databaseError(req, res, insertClientErr, connection);
        }

        const clientId = result.insertId;

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
          Boolean(req.body.eligibleToVote),
          Boolean(req.body.registeredToVote),
          req.session.passport.user.id
        ];

        const intakeDataValues = [
          clientId,
          req.body.dateOfIntake,
          requestEnum(req.body.clientSource),
          Boolean(req.body.couldVolunteer),
          req.session.passport.user.id
        ];

        const insertOther = mysql.format(
          `
          ${insertContactInformationQuery(
            clientId,
            req.body,
            req.session.passport.user.id
          )}

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
            registerToVote,
            registeredVoter,
            addedBy
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

          INSERT INTO intakeData (
            clientId,
            dateOfIntake,
            clientSource,
            couldVolunteer,
            addedBy
          ) VALUES (?, ?, ?, ?, ?);
        `,
          [...demographicsValues, ...intakeDataValues]
        );

        connection.query(insertOther, (err, results, fields) => {
          if (err) {
            connection.rollback();
            return databaseError(req, res, err, connection);
          }

          const intakeDataResult = results[2];
          const intakeDataId = intakeDataResult.insertId;

          if (req.body.intakeServices.length === 0) {
            connection.commit();

            returnTheClient();

            return;
          }

          const intakeServicesValues = req.body.intakeServices.reduce(
            (acc, intakeService) => {
              return [...acc, intakeDataId, intakeService];
            },
            []
          );

          const insertIntakeServicesQuery = req.body.intakeServices
            .map(
              intakeService => `
            INSERT INTO intakeServices (intakeDataId, serviceId) VALUES (?, ?);
          `
            )
            .join("");

          const insertIntakeServices = mysql.format(
            insertIntakeServicesQuery,
            intakeServicesValues
          );

          connection.query(insertIntakeServices, (err, result, fields) => {
            if (err) {
              connection.rollback();
              return databaseError(req, res, err, connection);
            }

            connection.commit();
            returnTheClient();
          });
        });

        function returnTheClient() {
          getClientById(connection, clientId, (err, client) => {
            if (err) {
              return databaseError(req, res, err, connection);
            }

            connection.release();

            res.send({
              client
            });
          });
        }
      });
    });
  });
});
