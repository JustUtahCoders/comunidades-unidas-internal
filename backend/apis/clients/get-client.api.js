const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound,
} = require("../../server");
const mysql = require("mysql2");
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
      INNER JOIN latestContactInformation contactInfo ON contactInfo.clientId = clients.id
      INNER JOIN latestDemographics demograph ON demograph.clientId = clients.id
      INNER JOIN latestIntakeData intake ON intake.clientId = clients.id
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
