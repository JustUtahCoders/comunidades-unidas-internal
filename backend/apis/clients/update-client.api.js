const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound
} = require("../../server");
const mysql = require("mysql");
const {
  checkValid,
  validId,
  validInteger,
  nullableNonEmptyString,
  nullableValidDate,
  nullableValidArray,
  nullableValidBoolean,
  nullableValidCountry,
  nullableValidEmail,
  nullableValidEnum,
  nullableValidInteger,
  nullableValidPhone,
  nullableValidState,
  nullableValidZip
} = require("../utils/validation-utils");
const { atLeastOne } = require("../utils/patch-utils");
const { getClientById } = require("./get-client.api");
const {
  insertContactInformationQuery,
  insertDemographicsInformationQuery,
  insertIntakeServicesQuery,
  insertIntakeDataQuery
} = require("./insert-client.utils");
const { insertActivityLogQuery } = require("./client-logs/activity-log.utils");
const { performAnyIntegrations } = require("./integrations/integrations-utils");

app.patch("/api/clients/:id", (req, res, next) => {
  const paramValidationErrors = checkValid(req.params, validId("id"));

  const bodyValidationErrors = checkValid(
    req.body,
    nullableNonEmptyString("firstName"),
    nullableNonEmptyString("lastName"),
    nullableValidDate("birthday"),
    nullableNonEmptyString("gender"),
    nullableValidDate("dateOfIntake"),
    nullableValidPhone("phone"),
    nullableValidBoolean("smsConsent"),
    nullableNonEmptyString("homeAddress.street"),
    nullableNonEmptyString("homeAddress.city"),
    nullableValidState("homeAddress.state"),
    nullableValidZip("homeAddress.zip"),
    nullableValidEmail("email"),
    nullableValidEnum(
      "civilStatus",
      "single",
      "married",
      "commonLawMarriage",
      "divorced",
      "widowed",
      "separated"
    ),
    nullableValidCountry("countryOfOrigin"),
    nullableValidDate("dateOfUSArrival"),
    nullableNonEmptyString("homeLanguage"),
    nullableValidEnum("currentlyEmployed", "yes", "no", "n/a", "unknown"),
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
    nullableValidInteger("householdIncome"),
    nullableValidInteger("householdSize"),
    nullableValidBoolean("isStudent"),
    nullableValidEnum("housingStatus", "renter", "homeowner", "other"),
    nullableValidEnum(
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
    nullableValidBoolean("couldVolunteer"),
    nullableValidArray("intakeServices", validInteger),
    nullableValidBoolean("registeredToVote"),
    nullableValidBoolean("eligibleToVote")
  );

  const validationErrors = [...paramValidationErrors, ...bodyValidationErrors];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const clientId = Number(req.params.id);

  getClientById(req.params.id, (selectErr, oldClient) => {
    if (selectErr) {
      return databaseError(req, res, err);
    }

    if (!oldClient) {
      return notFound(res, `Client ${clientId} does not exist`);
    }

    const fullClient = Object.assign({}, oldClient, req.body);

    const queries = [];

    const clientChanged = atLeastOne(
      req.body,
      "firstName",
      "lastName",
      "birthday",
      "gender"
    );

    if (clientChanged) {
      queries.push(
        mysql.format(
          `
        UPDATE clients
        SET
          firstName = ?,
          lastName = ?,
          birthday = ?,
          gender = ?,
          modifiedBy = ?
        WHERE id = ?;

        ${insertActivityLogQuery({
          clientId,
          title: "Basic information was updated",
          logType: "clientUpdated:basicInformation",
          addedBy: req.session.passport.user.id
        })}
      `,
          [
            fullClient.firstName,
            fullClient.lastName,
            fullClient.birthday,
            fullClient.gender,
            req.session.passport.user.id,
            clientId
          ]
        )
      );
    }

    const contactInfoChanged = atLeastOne(
      req.body,
      "phone",
      "smsConsent",
      "email",
      "address.street",
      "address.city",
      "address.state",
      "address.zip",
      "housingStatus"
    );

    if (contactInfoChanged) {
      queries.push(
        insertContactInformationQuery(
          clientId,
          fullClient,
          req.session.passport.user.id,
          true
        )
      );
    }

    const demographicsInfoChanged = atLeastOne(
      req.body,
      "civilStatus",
      "householdIncome",
      "dependents",
      "currentlyEmployed",
      "weeklyEmployedHours",
      "employmentSector",
      "payInterval",
      "countryOfOrigin",
      "dateOfUSArrival",
      "homeLanguage",
      "englishProficiency",
      "isStudent",
      "eligibleToVote",
      "registeredToVote"
    );

    if (demographicsInfoChanged) {
      queries.push(
        insertDemographicsInformationQuery(
          clientId,
          fullClient,
          req.session.passport.user.id,
          true
        )
      );
    }

    const intakeDataChanged = atLeastOne(
      req.body,
      "clientSource",
      "couldVolunteer",
      "dateOfIntake",
      "intakeServices"
    );

    if (intakeDataChanged) {
      queries.push(
        insertIntakeDataQuery(
          clientId,
          fullClient,
          req.session.passport.user.id
        )
      );

      queries.push(
        insertIntakeServicesQuery(
          {
            clientId: clientId,
            intakeServices: fullClient.intakeServices,
            userId: req.session.passport.user.id
          },
          true
        )
      );
    }

    if (queries.length === 0) {
      res.send({
        client: oldClient
      });

      return;
    }

    pool.query(queries.join("\n"), (patchErr, result) => {
      if (patchErr) {
        return databaseError(req, res, patchErr);
      }

      getClientById(req.params.id, (selectErr, client) => {
        if (selectErr) {
          return databaseError(req, res, selectErr, connection);
        }

        performAnyIntegrations(client, req.session.passport.user.id);

        res.send({
          client
        });
      });
    });
  });
});
