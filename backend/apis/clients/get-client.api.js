const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound,
} = require("../../server");
const mysql = require("mysql");
const { checkValid, validId } = require("../utils/validation-utils");
const {
  responseFullName,
  responseBoolean,
  responseDateWithoutTime,
} = require("../utils/transform-utils");

app.get("/api/clients/:id", (req, res, next) => {
  const validationErrors = checkValid(req.params, validId("id"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  getClientById(req.params.id, (err, client) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (client) {
      res.send({
        client,
      });
    } else {
      notFound(res, `Could not find client with id ${req.params.id}`);
    }
  });
});

exports.getClientById = getClientById;

function getClientById(clientId, cbk, connection) {
  clientId = Number(clientId);

  const getClient = mysql.format(
    `
    SELECT
      clients.id as clientId,
      clients.isDeleted,
      clients.firstName,
      clients.lastName,
      clients.gender,
      clients.birthday,
      clients.dateAdded as clientDateAdded,
      clients.dateModified as clientDateModified,
      clients.addedBy as createdById,
      clients.modifiedBy as modifiedById,
      intake.id as intakeId,
      intake.clientId,
      intake.dateOfIntake,
      intake.clientSource,
      intake.couldVolunteer,
      intake.dateAdded,
      intake.addedBy,
      contactInfo.*,
      demograph.*,
      created.id as createdById,
      created.firstName as createdByFirstName,
      created.lastName as createdByLastName,
      modified.id as modifiedById,
      modified.firstName as modifiedByFirstName,
      modified.lastName as modifiedByLastName
    FROM clients
      INNER JOIN (
        SELECT *
        FROM
          contactInformation innerContactInformation
          JOIN (
            SELECT clientId latestClientId, MAX(dateAdded) latestDateAdded
            FROM contactInformation GROUP BY clientId
          ) latestContactInformation
          ON latestContactInformation.latestDateAdded = innerContactInformation.dateAdded
      ) contactInfo ON contactInfo.clientId = clients.id
      INNER JOIN (
        SELECT *
        FROM
          demographics innerDemographics
          JOIN (
            SELECT clientId latestClientId, MAX(dateAdded) latestDateAdded
            FROM demographics GROUP BY clientId
          ) latestDemographics
          ON latestDemographics.latestDateAdded = innerDemographics.dateAdded
      ) demograph ON demograph.clientId = clients.id
      INNER JOIN (
        SELECT *
        FROM
          intakeData innerIntake
          JOIN (
            SELECT clientId latestClientId, MAX(dateAdded) latestDateAdded
            FROM intakeData GROUP BY clientId
          ) latestIntake
          ON latestIntake.latestDateAdded = innerIntake.dateAdded
      ) intake ON intake.clientId = clients.id
      INNER JOIN users created ON created.id = clients.addedBy
      INNER JOIN users modified ON modified.id = clients.modifiedBy
      WHERE clients.id = ? AND isDeleted = false;

    SELECT serviceId, serviceName
    FROM
      intakeServices
      JOIN
      services ON intakeServices.serviceId = services.id
    WHERE intakeDataId = (
      SELECT id from intakeData WHERE clientId = ? ORDER BY dateAdded DESC LIMIT 1
    );
  `,
    [clientId, clientId]
  );

  (connection || pool).query(getClient, (err, data, fields) => {
    if (err) {
      return cbk(err, data, fields);
    }

    const bigClientObj = data[0];
    const intakeServices = data[1];

    if (bigClientObj.length === 0) {
      return cbk(err, null);
    }

    const c = bigClientObj[0];

    const client = {
      id: c.clientId,
      isDeleted: responseBoolean(c.isDeleted),
      firstName: c.firstName,
      lastName: c.lastName,
      fullName: responseFullName(c.firstName, c.lastName),
      birthday: responseDateWithoutTime(c.birthday),
      gender: c.gender,
      phone: c.primaryPhone,
      smsConsent: responseBoolean(c.textMessages),
      homeAddress: {
        street: c.address,
        city: c.city,
        state: c.state,
        zip: c.zip,
      },
      email: c.email,
      civilStatus: c.civilStatus,
      countryOfOrigin: c.countryOfOrigin,
      dateOfUSArrival: responseDateWithoutTime(c.dateOfUSArrival),
      homeLanguage: c.homeLanguage,
      englishProficiency: c.englishProficiency,
      currentlyEmployed: c.employed,
      employmentSector: c.employmentSector,
      payInterval: c.payInterval,
      weeklyEmployedHours: c.weeklyAvgHoursWorked,
      householdIncome: c.householdIncome,
      householdSize: c.householdSize,
      dependents: c.dependents,
      housingStatus: c.housingStatus,
      isStudent: responseBoolean(c.isStudent),
      eligibleToVote: responseBoolean(c.registerToVote),
      registeredToVote: responseBoolean(c.registeredVoter),
      clientSource: c.clientSource,
      couldVolunteer: responseBoolean(c.couldVolunteer),
      dateOfIntake: responseDateWithoutTime(c.dateOfIntake),
      intakeServices: intakeServices.map((intakeService) => ({
        id: intakeService.serviceId,
        serviceName: intakeService.serviceName,
      })),
      createdBy: {
        userId: c.createdById,
        firstName: c.createdByFirstName,
        lastName: c.createdByLastName,
        fullName: responseFullName(c.createdByFirstName, c.createdByLastName),
        timestamp: c.clientDateAdded,
      },
      lastUpdatedBy: {
        userId: c.modifiedById,
        firstName: c.modifiedByFirstName,
        lastName: c.modifiedByLastName,
        fullName: responseFullName(c.modifiedByFirstName, c.modifiedByLastName),
        timestamp: c.clientDateModified,
      },
    };

    cbk(err, client);
  });
}

exports.getAllClientsById = getAllClientsById;

function getAllClientsById(clients, cbk, connection) {
  clients = clients.map((item) => Number(item));

  const getClient = mysql.format(
    `
    SELECT
      clients.id as clientId,
      clients.isDeleted,
      clients.firstName,
      clients.lastName,
      clients.gender,
      clients.birthday,
      clients.dateAdded as clientDateAdded,
      clients.dateModified as clientDateModified,
      clients.addedBy as createdById,
      clients.modifiedBy as modifiedById,
      intake.id as intakeId,
      intake.clientId,
      intake.dateOfIntake,
      intake.clientSource,
      intake.couldVolunteer,
      intake.dateAdded,
      intake.addedBy,
      contactInfo.*,
      demograph.*,
      created.id as createdById,
      created.firstName as createdByFirstName,
      created.lastName as createdByLastName,
      modified.id as modifiedById,
      modified.firstName as modifiedByFirstName,
      modified.lastName as modifiedByLastName
    FROM clients
      INNER JOIN (
        SELECT *
        FROM
          contactInformation innerContactInformation
          JOIN (
            SELECT clientId latestClientId, MAX(dateAdded) latestDateAdded
            FROM contactInformation GROUP BY clientId
          ) latestContactInformation
          ON latestContactInformation.latestDateAdded = innerContactInformation.dateAdded
      ) contactInfo ON contactInfo.clientId = clients.id
      INNER JOIN (
        SELECT *
        FROM
          demographics innerDemographics
          JOIN (
            SELECT clientId latestClientId, MAX(dateAdded) latestDateAdded
            FROM demographics GROUP BY clientId
          ) latestDemographics
          ON latestDemographics.latestDateAdded = innerDemographics.dateAdded
      ) demograph ON demograph.clientId = clients.id
      INNER JOIN (
        SELECT *
        FROM
          intakeData innerIntake
          JOIN (
            SELECT clientId latestClientId, MAX(dateAdded) latestDateAdded
            FROM intakeData GROUP BY clientId
          ) latestIntake
          ON latestIntake.latestDateAdded = innerIntake.dateAdded
      ) intake ON intake.clientId = clients.id
      INNER JOIN users created ON created.id = clients.addedBy
      INNER JOIN users modified ON modified.id = clients.modifiedBy
      WHERE clients.id IN (?) AND isDeleted = false;

    SELECT serviceId, serviceName
    FROM
      intakeServices
      JOIN
      services ON intakeServices.serviceId = services.id
    WHERE intakeDataId = (
      SELECT id from intakeData WHERE clientId IN (?) ORDER BY dateAdded DESC LIMIT 1
    );
  `,
    [clients, clients]
  );

  (connection || pool).query(getClient, (err, data, fields) => {
    if (err) {
      return cbk(err, data, fields);
    }

    const allClientsObjects = data[0];
    const allIntakeServices = data[1];

    if (allClientsObjects.length === 0) {
      return cbk(err, null);
    }

    const c = allClientsObjects[0];
    const clients = allClientsObjects.map((client) => {
      return {
        id: client.clientId,
        isDeleted: responseBoolean(client.isDeleted),
        firstName: client.firstName,
        lastName: client.lastName,
        fullName: responseFullName(client.firstName, client.lastName),
        birthday: responseDateWithoutTime(client.birthday),
        gender: client.gender,
        phone: client.primaryPhone,
        smsConsent: responseBoolean(client.textMessages),
        homeAddress: {
          street: client.address,
          city: client.city,
          state: client.state,
          zip: client.zip,
        },
        email: client.email,
        civilStatus: client.civilStatus,
        countryOfOrigin: client.countryOfOrigin,
        dateOfUSArrival: responseDateWithoutTime(client.dateOfUSArrival),
        homeLanguage: client.homeLanguage,
        englishProficiency: client.englishProficiency,
        currentlyEmployed: client.employed,
        employmentSector: client.employmentSector,
        payInterval: client.payInterval,
        weeklyEmployedHours: client.weeklyAvgHoursWorked,
        householdIncome: client.householdIncome,
        householdSize: client.householdSize,
        dependents: client.dependents,
        housingStatus: client.housingStatus,
        isStudent: responseBoolean(client.isStudent),
        eligibleToVote: responseBoolean(client.registerToVote),
        registeredToVote: responseBoolean(client.registeredVoter),
        clientSource: client.clientSource,
        couldVolunteer: responseBoolean(client.couldVolunteer),
        dateOfIntake: responseDateWithoutTime(client.dateOfIntake),
        intakeServices: allIntakeServices.map((intakeService) => ({
          id: intakeService.serviceId,
          serviceName: intakeService.serviceName,
        })),
        createdBy: {
          userId: client.createdById,
          firstName: client.createdByFirstName,
          lastName: client.createdByLastName,
          fullName: responseFullName(
            client.createdByFirstName,
            client.createdByLastName
          ),
          timestamp: client.clientDateAdded,
        },
        lastUpdatedBy: {
          userId: client.modifiedById,
          firstName: client.modifiedByFirstName,
          lastName: client.modifiedByLastName,
          fullName: responseFullName(
            client.modifiedByFirstName,
            client.modifiedByLastName
          ),
          timestamp: client.clientDateModified,
        },
      };
    });

    cbk(err, clients);
  });
}
