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
const path = require("path");
const fs = require("fs");
const rawGetSql = fs.readFileSync(
  path.join(__dirname, "./get-clients-by-id.sql")
);

app.get("/api/clients/:clientIds/multi", (req, res) => {
  // const validationErrors = checkValid(req.params, validId("id")); --> check out what validation function does, use for array of client ids
  // validations here
  const clientIds = JSON.parse(req.params.clientIds);

  getAllClientsById(clientIds, (err, clients) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (clients) {
      res.send({
        clients,
      });
    } else {
      notFound(res, `Could not find clients with ids ${req.params.clientIds}`);
    }
  });
});

exports.getAllClientsById = getAllClientsById;

function getAllClientsById(clients, cbk, connection) {
  clients = clients.map((item) => Number(item));
  const getClient = mysql.format(rawGetSql, [clients, clients]);

  pool.query(getClient, (err, data, fields) => {
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
