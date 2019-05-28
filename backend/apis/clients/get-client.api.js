const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");
const { checkValid, validId } = require("../utils/validation-utils");
const {
  responseFullName,
  responseDateWithoutTime
} = require("../utils/transform-utils");

app.get("/api/clients/:id", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err, connection);
    }

    const validationErrors = checkValid(req.params, validId("id"));

    if (validationErrors.length > 0) {
      return invalidRequest(res, validationErrors);
    }

    getClientById(connection, req.params.id, (err, client) => {
      if (err) {
        return databaseError(req, res, err, connection);
      }

      connection.release();

      if (client) {
        res.send({
          client
        });
      } else {
        res.status(404).send({
          errors: [`Could not find client with id ${req.params.id}`]
        });
      }
    });
  });
});

exports.getClientById = getClientById;

function getClientById(connection, clientId, cbk) {
  clientId = Number(clientId);

  const getClient = mysql.format(
    `
    SELECT
      clients.id as clientId,
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
        SELECT * FROM contactInformation ORDER BY dateAdded DESC LIMIT 1
      ) contactInfo ON contactInfo.clientId = clients.id
      INNER JOIN (
        SELECT * FROM demographics ORDER BY dateAdded DESC LIMIT 1
      ) demograph ON demograph.clientId = clients.id
      INNER JOIN (
        SELECT * FROM intakeData ORDER BY dateAdded DESC LIMIT 1
      ) intake ON intake.clientId = clients.id
      INNER JOIN users created ON created.id = clients.addedBy
      INNER JOIN users modified ON modified.id = clients.modifiedBy
      WHERE clients.id = ?
  `,
    [clientId]
  );

  connection.query(getClient, (err, data, fields) => {
    if (err) {
      return cbk(err, data, fields);
    }

    if (data.length === 0) {
      return cbk(err, null);
    }

    const c = data[0];

    const client = {
      id: c.clientId,
      firstName: c.firstName,
      lastName: c.lastName,
      fullName: responseFullName(c.firstName, c.lastName),
      birthday: responseDateWithoutTime(c.birthday),
      gender: c.gender,
      phone: c.primaryPhone,
      smsConsent: Boolean(c.textMessages),
      homeAddress: {
        street: c.address,
        city: c.city,
        state: c.state,
        zip: c.zip
      },
      email: c.email,
      civilStatus: c.civilStatus,
      countryOfOrigin: c.countryOfOrigin,
      dateOfUSArrival: c.dateOfUSArrival,
      homeLanguage: c.homeLanguage,
      currentlyEmployed: c.employed,
      employmentSector: c.employmentSector,
      payInterval: c.payInterval,
      weeklyEmployedHours: c.weeklyEmployedHours,
      householdIncome: c.householdIncome,
      householdSize: c.householdSize,
      dependents: c.dependents,
      housingStatus: c.housingStatus,
      isStudent: Boolean(c.isStudent),
      eligibleToVote: Boolean(c.registerToVote),
      registeredToVote: Boolean(c.registeredVoter),
      clientSource: c.clientSource,
      couldVolunteer: Boolean(c.couldVolunteer),
      dateOfIntake: responseDateWithoutTime(c.dateOfIntake),
      intakeServices: [],
      createdBy: {
        userId: c.createdById,
        firstName: c.createdByFirstName,
        lastName: c.createdByLastName,
        fullName: responseFullName(c.createdByFirstName, c.createdByLastName),
        timestamp: c.clientDateAdded
      },
      lastUpdatedBy: {
        userId: c.modifiedById,
        firstName: c.modifiedByFirstName,
        lastName: c.modifiedByLastName,
        fullName: responseFullName(c.modifiedByFirstName, c.modifiedByLastName),
        timestamp: c.clientDateModified
      }
    };

    cbk(err, client);
  });
}
