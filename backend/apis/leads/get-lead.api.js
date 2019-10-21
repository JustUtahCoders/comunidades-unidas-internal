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
        modified.lastName AS modifiedByLastName,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            "serviceId", leadServices.serviceId,
            "serviceName", services.serviceName
          )
        ) AS leadServices,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            "eventId", leadEvents.eventId,
            "eventName", events.eventName,
            "eventLocation", events.eventLocation
          )
        ) AS eventSources
      FROM leads
        INNER JOIN users created 
          ON created.id = leads.addedBy
        INNER JOIN users modified 
          ON modified.id = leads.modifiedBy
        INNER JOIN leadServices 
          ON leadServices.leadId = leads.id
        INNER JOIN services 
          ON services.id = leadServices.serviceId
        INNER JOIN leadEvents
          ON leadEvents.leadId = leads.id
        INNER JOIN events
          ON events.id = leadEvents.eventId
      WHERE leads.id = ? AND leads.isDeleted = false;
    `,
    [leadId]
  );

  (connection || pool).query(getLead, (err, data, fields) => {
    if (err) {
      return cbk(err, data, fields);
    }

    const bigLeadObj = data[0];

    if (bigLeadObj.length === 0) {
      return cbk(err, null);
    }

    const l = bigLeadObj;
    const leadServices = JSON.parse(l.leadServices);
    const eventSources = JSON.parse(l.eventSources);

    const lead = {
      id: l.leadId,
      dateOfSignUp: responseDateWithoutTime(l.dateOfSignUp),
      leadStatus: l.leadStatus,
      contactStage: {
        first: l.firstContactAttempt,
        second: l.secondContactAttempt,
        third: l.thirdContactAttempt
      },
      inactivityReason: l.inactivityReason,
      eventSource: eventSources.map(event => ({
        eventId: event.eventId,
        eventName: event.eventName,
        eventLocation: event.eventLocation
      })),
      firstName: l.firstName,
      lastName: l.lastName,
      phone: l.phone,
      smsConsent: responseBoolean(l.smsConsent),
      zip: l.zip,
      age: l.age,
      gender: l.gender,
      leadServices: leadServices.map(service => ({
        id: service.serviceId,
        serviceName: service.serviceName
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
