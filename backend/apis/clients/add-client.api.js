const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");
const { requestEnum } = require("../utils/transform-utils");
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
  nullableValidEmail,
  nullableValidEnum,
  validEnum,
  validCountry,
  validArray,
  validInteger
} = require("../utils/validation-utils");
const { getClientById } = require("./get-client.api");
const {
  insertContactInformationQuery,
  insertIntakeDataQuery,
  insertDemographicsInformationQuery
} = require("./insert-client.utils");
const { insertActivityLogQuery } = require("./activity-log.utils");

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
      nullableValidEmail("email"),
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
      validEnum("housingStatus", "renter", "homeowner", "other"),
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

        const insertActivityLog = insertActivityLogQuery({
          clientId,
          title: "Client was created",
          description: null,
          logType: "clientCreated",
          addedBy: req.session.passort.user.id
        });

        connection.query(insertActivityLog, (err, results) => {
          if (err) {
            connection.rollback();
            return databaseError(req, res, err, connection);
          }

          const insertOther = mysql.format(`
            ${insertContactInformationQuery(
              clientId,
              req.body,
              req.session.passport.user.id
            )}

            ${insertDemographicsInformationQuery(
              clientId,
              req.body,
              req.session.passport.user.id
            )}

            ${insertIntakeDataQuery(
              clientId,
              req.body,
              req.session.passport.user.id
            )}
          `);

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
