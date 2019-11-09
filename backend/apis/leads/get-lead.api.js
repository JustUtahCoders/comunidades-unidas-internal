const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound
} = require("../../server");
const mysql = require("mysql");
const { checkValid, validId } = require("../utils/validation-utils");
const {
  responseFullName,
  responseBoolean,
  responseDateWithoutTime
} = require("../utils/transform-utils");

app.get("/api/leads/:id", (req, res, next) => {
  const validationErrors = checkValid(req.params, validId("id"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  getLeadById(req.params.id, (err, lead) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (lead) {
      res.send({
        lead
      });
    } else {
      notFound(res, `Could not find lead with id ${req.params.id}`);
    }
  });
});

exports.getLeadById = getLeadById;

function getLeadById(leadId, cbk, connection) {
  leadId = Number(leadId);

  const getLead = mysql.format(
    `
      SELECT
        leads.id AS leadId,
        leads.dateOfSignUp,
        leads.leadStatus,
        leads.firstContactAttempt,
        leads.secondContactAttempt,
        leads.thirdContactAttempt,
        leads.inactivityReason,
        leads.firstName,
        leads.lastName,
        leads.phone,
        leads.smsConsent,
        leads.zip,
        leads.age,
        leads.gender,
        leads.clientId,
        leads.isDeleted,
        leads.dateAdded,
        leads.dateModified,
        leads.addedBy,
        leads.modifiedBy,
        created.firstName AS createdByFirstName,
        created.lastName AS createdByLastName,
        modified.firstName AS modifiedByFirstName,
        modified.lastName AS modifiedByLastName
      FROM leads
        INNER JOIN users AS created 
          ON created.id = leads.addedBy
        INNER JOIN users AS modified 
          ON modified.id = leads.modifiedBy
      WHERE leads.id = ? AND leads.isDeleted = false;

      SELECT 
        leadEvents.eventId,
        events.eventName,
        events.eventLocation,
        events.eventDate
      FROM leadEvents
        INNER JOIN events 
          ON events.id = leadEvents.eventId
      WHERE leadId = ?;

      SELECT 
        leadServices.serviceId,
        services.serviceName,
        programs.programName
      FROM leadServices
        INNER JOIN services
          ON services.id = leadServices.serviceId
        INNER JOIN programs
          ON programs.id = services.programId
      WHERE leadId = ?;
    `,
    [leadId, leadId, leadId]
  );

  (connection || pool).query(getLead, (err, data, fields) => {
    if (err) {
      return cbk(err, data, fields);
    }

    const bigLeadObj = data[0];
    const eventSources = data[1];
    const leadServices = data[2];

    if (bigLeadObj.length === 0) {
      return cbk(err, null);
    }

    const l = bigLeadObj[0];

    const lead = {
      id: l.leadId,
      dateOfSignUp: responseDateWithoutTime(l.dateOfSignUp),
      leadStatus: l.leadStatus === null ? "active" : l.leadStatus,
      contactStage: {
        first: l.firstContactAttempt,
        second: l.secondContactAttempt,
        third: l.thirdContactAttempt
      },
      inactivityReason: l.inactivityReason,
      eventSources: eventSources.map(event => ({
        eventId: event.eventId,
        eventName: event.eventName,
        eventLocation: event.eventLocation,
        eventDate: responseDateWithoutTime(event.eventDate)
      })),
      firstName: l.firstName,
      lastName: l.lastName,
      fullName: responseFullName(l.firstName, l.lastName),
      phone: l.phone,
      smsConsent: responseBoolean(l.smsConsent),
      zip: l.zip,
      age: l.age,
      gender: l.gender,
      leadServices: leadServices.map(service => ({
        id: service.serviceId,
        serviceName: service.serviceName,
        programName: service.programName
      })),
      clientId: l.clientId,
      isDeleted: responseBoolean(l.isDeleted),
      createdBy: {
        userId: l.addedBy,
        firstName: l.createdByFirstName,
        lastName: l.createdByLastName,
        fullName: responseFullName(l.createdByFirstName, l.createdByLastName),
        timestamp: l.dateAdded
      },
      lastUpdatedBy: {
        userId: l.modifiedBy,
        firstName: l.modifiedByFirstName,
        lastName: l.modifiedByLastName,
        fullName: responseFullName(l.modifiedByFirstName, l.modifiedByLastName),
        timestamp: l.dateModified
      }
    };

    cbk(err, lead);
  });
}
