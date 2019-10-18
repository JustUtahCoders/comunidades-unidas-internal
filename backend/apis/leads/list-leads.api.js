const { app, databaseError, pool } = require("../../server");
const mysql = require("mysql");
const {
  checkValid,
  nullableValidInteger
} = require("../utils/validation-utils");
const {
  responseFullName,
  responseBoolean,
  responseDateWithoutTime
} = require("../utils/transform-utils");

app.get("/api/leads", (req, res, next) => {
  const validationErrors = checkValid(req.query, nullableValidInteger("page"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const pageSize = 100;
  const requestPage = parseInt(req.query.page);
  const zeroBasedPage = req.query.page ? requestPage - 1 : 0;
  const mysqlOffset = zeroBasedPage * pageSize;

  if (requestPage < 1) {
    return invalidRequest(
      res,
      `Invalid page ${0}. Must be an integer greater than or equal to 1`
    );
  }

  const mysqlQuery = `
    SELECT SQL_CALC_FOUND_ROWS
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
      events.id AS eventId,
      events.eventName,
      events.eventLocation,
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
      INNER JOIN events
        ON events.id = leads.eventSource
    WHERE leads.isDeleted = false
    GROUP BY leadServices.leadId
    LIMIT ?, ?;

    SELECT FOUND_ROWS();
  `;

  const getLeads = mysql.format(mysqlQuery, [mysqlOffset, pageSize]);

  pool.query(getLeads, (err, results) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [leadRowsResults, totalCountRows] = results;

    const totalCount = totalCountRows[0]["FOUND_ROWS()"];

    const mapLeadsData = leadRowsResults.map(result => {
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
        eventSource: {
          eventId: result.eventId,
          eventName: result.eventName,
          eventLocation: result.eventLocation
        },
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
      leads: mapLeadsData,
      pagination: {
        currentPage: zeroBasedPage + 1,
        pageSize,
        numLeads: totalCount,
        numPages: Math.ceil(totalCount / pageSize)
      }
    });
  });
});
