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
  const getLead = mysql
    .format(
      `
      SELECT
        l.id AS leadId,
        l.dateOfSignUp,
        l.leadStatus,
        l.firstContactAttempt,
        l.secondContactAttempt,
        l.thirdContactAttempt,
        l.inactivityReason,
        l.eventSource AS eventId,
        e.eventName,
        e.eventLocation,
        l.firstName,
        l.lastName,
        l.phone,
        l.smsConsent,
        l.zip,
        l.age,
        l.gender,
        l.clientId,
        l.isDeleted,
        l.dateAdded,
        l.dateModified,
        l.addedBy AS createdByUserId,
        l.modifiedBy AS modifiedByUserId,
        created.firstName,
        created.lastName,
        modified.firstName,
        modified.lastName
      FROM leads AS l
        INNER JOIN events AS e ON e.id = l.eventSource
        INNER JOIN users AS created ON created.id = l.addedBy
        INNER JOIN users AS modified ON modified.id = l.modifiedBy
      WHERE l.id = ? AND l.isDeleted = false;

      SELECT 
        ls.serviceId,
        s.serviceName
      FROM leadServices AS ls
        JOIN services AS s ON s.id = ls.serviceId
      WHERE ls.leadId = ?;
    `,
      [leadId, leadId]
    )
    (connection || pool)
    .query(getLead, (err, data, fields) => {
      if (err) {
        return cbk(err, data, fields);
      }

      const bigLeadObj = data[0];
      const leadServices = data[1];

      if (bigLeadObj.length === 0) {
        return cbk(err, null);
      }

      const l = bigLeadObj[0];

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
        eventSource: {
          eventId: l.eventId,
          eventName: l.eventName,
          eventLocation: l.eventLocation
        },
        firstName: l.firstName,
        lastName: l.lastName,
        fullName: responseFullName(l.firstName, l.lastName),
        phone: l.phone,
        smsConsent: responseBoolean(l.smsConsent),
        zip: l.zip,
        age: l.age,
        gender: l.gender,
        leadServices: [
          leadServices.map(leadService => ({
            id: leadService.id,
            serviceName: leadService.serviceName
          }))
        ],
        isDeleted: l.isDeleted,
        createdBy: {
          userId: l.createdByUserId,
          firstName: l.createdByFirstName,
          lastName: l.createdByLastName,
          fullName: responseFullName(l.createdByFirstName, l.createdByLastName),
          timestamp: l.dateAdded
        },
        lastUpdatedBy: {
          userId: l.modifiedByUserId,
          firstName: l.modifiedByFirstName,
          lastName: l.modifiedByLastName,
          fullName: responseFullName(
            l.modifiedByFirstName,
            l.modifiedByLastName
          ),
          timestamp: l.dateModified
        }
      };

      cbk(err, client);
    });
}
