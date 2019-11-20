const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");
const {
  checkValid,
  nullableValidInteger,
  nullableNonEmptyString,
  nullableValidId
} = require("../utils/validation-utils");
const {
  responseFullName,
  requestPhone,
  responseBoolean,
  responseDateWithoutTime
} = require("../utils/transform-utils");

app.get("/api/leads", (req, res, next) => {
  const validationErrors = checkValid(
    req.query,
    nullableValidInteger("page"),
    nullableValidId("id"),
    nullableNonEmptyString("phone"),
    nullableNonEmptyString("zip"),
    nullableValidId("program"),
    nullableValidId("event")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const requestPage = parseInt(req.query.page);

  let whereClause = `WHERE leads.isDeleted = false `;
  let whereClauseValues = [];

  if (requestPage < 1) {
    return invalidRequest(
      res,
      `Invalid page ${0}. Must be an integer greater than or equal to 1`
    );
  }

  const pageSize = 100;

  if (req.query.name) {
    whereClause += `AND CONCAT(leads.firstName, ' ', leads.lastName) LIKE ? `;
    whereClauseValues.push(`%${req.query.name}%`);
  }

  if (req.query.zip) {
    whereClause += `AND leads.zip = ? `;
    whereClauseValues.push(req.query.zip);
  }

  if (req.query.id) {
    whereClause += `AND leads.id = ? `;
    whereClauseValues.push(req.query.id);
  }

  if (req.query.phone) {
    whereClause += `AND leads.phone LIKE ? `;
    whereClauseValues.push("%" + requestPhone(req.query.phone) + "%");
  }

  if (req.query.program) {
    whereClause += `
      AND services.programId = ?
    `;
    whereClauseValues.push(req.query.program);
  }

  if (req.query.event) {
    whereClause += `
      AND leadEvents.eventId = ?
    `;
    whereClauseValues.push(req.query.event);
  }

  let mysqlQuery = `
    SELECT SQL_CALC_FOUND_ROWS
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
          "eventLocation", events.eventLocation,
          "eventDate", events.eventDate
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
    ${whereClause}
    GROUP BY leadServices.leadId
    LIMIT ?, ?;
    SELECT FOUND_ROWS();
  `;

  const zeroBasedPage = req.query.page ? requestPage - 1 : 0;
  const mysqlOffset = zeroBasedPage * pageSize;
  const getLeads = mysql.format(mysqlQuery, [
    ...whereClauseValues,
    mysqlOffset,
    pageSize
  ]);

  pool.query(getLeads, (err, results, fields) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [leadRows, totalCountRows] = results;

    const totalCount = totalCountRows[0]["FOUND_ROWS()"];

    const mapLeadsData = leadRows.map(result => {
      const leadServices = JSON.parse(result.leadServices);
      const eventSources = JSON.parse(result.eventSources);

      return {
        id: result.leadId,
        dateOfSignUp: responseDateWithoutTime(result.dateOfSignUp),
        leadStatus: result.leadStatus === null ? "active" : result.leadStatus,
        contactStage: {
          first: result.firstContactAttempt,
          second: result.secondContactAttempt,
          third: result.thirdContactAttempt
        },
        inactivityReason: result.inactivityReason,
        eventSources: eventSources.map(event => ({
          eventId: event.eventId,
          eventName: event.eventName,
          eventLocation: event.eventLocation,
          eventDate: event.eventDate
        })),
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
          userId: result.addedBy,
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
