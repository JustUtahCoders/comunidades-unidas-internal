const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");
const {
  nullableValidDate,
  checkValid,
  nullableNonEmptyString,
  nonEmptyString,
  validDate,
  validPhone,
  nullableValidPhone,
  validBoolean,
  validState,
  nullableValidState,
  validZip,
  nullableValidZip,
  nullableValidEmail,
  nullableValidEnum,
  validEnum,
  validCountry,
  validArray,
  validInteger,
  nullableValidId,
  nullableValidBoolean,
  nullableValidCountry,
  nullableValidArray,
  nullableValidInteger,
} = require("../utils/validation-utils");
const { getClientById } = require("./get-client.api");
const {
  insertContactInformationQuery,
  insertIntakeDataQuery,
  insertDemographicsInformationQuery,
  convertLeadToClient,
} = require("./insert-client.utils");
const { insertActivityLogQuery } = require("./client-logs/activity-log.utils");

app.post("/api/clients", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err, connection);
    }

    const strict = req.query.strict !== "false";

    const sometimesNonEmptyString = strict
      ? nonEmptyString
      : nullableNonEmptyString;
    const sometimesValidPhone = strict ? validPhone : nullableValidPhone;
    const sometimesValidBoolean = strict ? validBoolean : nullableValidBoolean;
    const sometimesValidState = strict ? validState : nullableValidState;
    const sometimesValidZip = strict ? validZip : nullableValidZip;
    const sometimesValidEnum = strict ? validEnum : nullableValidEnum;
    const sometimesValidCountry = strict ? validCountry : nullableValidCountry;
    const sometimesValidInteger = strict ? validInteger : nullableValidInteger;
    const sometimesValidArray = strict ? validArray : nullableValidArray;
    const sometimesValidDate = strict ? validDate : nullableValidDate;

    const validityErrors = checkValid(
      req.body,
      nonEmptyString("firstName"),
      nonEmptyString("lastName"),
      sometimesValidDate("birthday"),
      nullableNonEmptyString("gender"),
      validDate("dateOfIntake"),
      sometimesValidPhone("phone"),
      sometimesValidBoolean("smsConsent"),
      sometimesNonEmptyString("homeAddress.street"),
      sometimesNonEmptyString("homeAddress.city"),
      sometimesValidState("homeAddress.state"),
      sometimesValidZip("homeAddress.zip"),
      nullableValidEmail("email"),
      sometimesValidEnum(
        "civilStatus",
        "single",
        "married",
        "commonLawMarriage",
        "divorced",
        "widowed",
        "separated"
      ),
      sometimesValidCountry("countryOfOrigin"),
      nullableValidDate("dateOfUSArrival"),
      sometimesNonEmptyString("homeLanguage"),
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
      sometimesValidInteger("householdIncome"),
      sometimesValidInteger("householdSize"),
      nullableValidInteger("juvenileDependents"),
      sometimesValidBoolean("isStudent"),
      sometimesValidEnum("housingStatus", "renter", "homeowner", "other"),
      sometimesValidEnum(
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
        "promotora",
        "other"
      ),
      sometimesValidBoolean("couldVolunteer"),
      sometimesValidArray("intakeServices", validInteger),
      nullableValidId("leadId")
    );

    if (validityErrors.length > 0) {
      return invalidRequest(res, validityErrors, connection);
    }

    const intakeServices = req.body.intakeServices || [];

    connection.beginTransaction((err) => {
      if (err) {
        return databaseError(req, res, err, connection);
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
          req.session.passport.user.id,
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
          addedBy: req.session.passport.user.id,
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

            ${
              req.body.leadId
                ? convertLeadToClient(
                    req.body.leadId,
                    clientId,
                    req.session.passport.user.id
                  )
                : ""
            }
          `);

          connection.query(insertOther, (err, results, fields) => {
            if (err) {
              connection.rollback();
              return databaseError(req, res, err, connection);
            }

            const intakeDataResult = results[2];
            const intakeDataId = intakeDataResult.insertId;

            if (intakeServices.length === 0) {
              returnTheClient();

              return;
            }

            const intakeServicesValues = intakeServices.reduce(
              (acc, intakeService) => {
                return [...acc, intakeDataId, intakeService];
              },
              []
            );

            const insertIntakeServicesQuery = intakeServices
              .map(
                (intakeService) => `
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

              returnTheClient();
            });
          });
        });

        function returnTheClient() {
          getClientById(
            clientId,
            (err, client) => {
              if (err) {
                return databaseError(req, res, err, connection);
              }

              connection.commit();
              connection.release();

              res.send({
                client,
              });
            },
            connection
          );
        }
      });
    });
  });
});
