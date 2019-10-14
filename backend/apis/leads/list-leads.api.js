const { app, databaseError, pool } = require("../../server");
const mysql = require("mysql");
const {
  responseFullName,
  responseBoolean,
  responseDateWithoutTime
} = require("../utils/transform-utils");

app.get("/api/leads", (req, res, next) => {
  const getLeads = mysql.format(`
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
      ) AS leadServices
    FROM leads
      INNER JOIN users created 
        ON created.id = leads.addedBy
      INNER JOIN users modified 
        ON modified.id = leads.modifiedBy
      INNER JOIN leadServices 
        ON leadServices.leadId = leads.id
      INNER JOIN services 
        ON services.id = leadServices.serviceId
    WHERE leads.isDeleted = false
    GROUP BY leadServices.leadId;
  `);

  pool.query(getLeads, (err, results) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const mapLeadsData = results.map(result => {
      const leadServices = JSON.parse(result.leadServices);

      return {
        id: result.leadId,
        dateOfSignUp: responseDateWithoutTime(result.dateOfSignUp),
        leadStatus: result.leadStatus,
        contactStage: {
          first: result.firstContactAttempt,
          second: result.secondContactAttempt,
          third: result.thirdContactAttempt
        },
        inactivityReason: result.inactivityReason,
        firstName: result.firstName,
        lastName: result.lastName,
        fullName: responseFullName(result.firstName, result.lastName),
        phone: result.phone,
        smsConsent: responseBoolean(result.smsConsent),
        zip: result.zip,
        age: result.age,
        gender: result.gender,
        leadServices: leadServices.map(service => ({
          id: service.serviceId,
          serviceName: service.serviceName
        })),
        clientId: result.clientId,
        isDeleted: responseBoolean(result.isDeleted),
        createdBy: {
          usedId: result.addedBy,
          firstName: result.createdByFirstName,
          lastName: result.createdByLastName,
          fullName: responseFullName(
            result.createdByFirstName,
            result.createdByLastName
          ),
          timestamp: result.dateAdded
        },
        lastUpdatedBy: {
          userId: result.modifiedBy,
          firstName: result.modifiedByFirstName,
          lastName: result.modifiedByLastName,
          fullName: responseFullName(
            result.modifiedByFirstName,
            result.modifiedByLastName
          ),
          timestamp: result.dateModified
        }
      };
    });

    res.send({
      leads: mapLeadsData
    });
  });
});
