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
      AND (
        SELECT COUNT(*)
        FROM leadServices
        WHERE leadServices.leadId = leads.id
          AND leadServices.serviceId IN (
            SELECT id 
            FROM services 
            WHERE programId = ?
          )
      ) > 0
    `;
    whereClauseValues.push(req.query.program);
  }

  if (req.query.event) {
    whereClause += `
      AND (
        SELECT COUNT(*)
        FROM leadEvents
        WHERE leadEvents.leadId = leads.id
          AND leadEvents.eventId IN (
              SELECT id 
              FROM events 
              WHERE eventId = events.id
            )
      ) > 0
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
      modified.lastName AS modifiedByLastName
    FROM leads
      INNER JOIN users created 
        ON created.id = leads.addedBy
      INNER JOIN users modified 
        ON modified.id = leads.modifiedBy
    ${whereClause}
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

    const leads = [];

    leadRows.forEach(lead => {
      const getMoreData = mysql.format(
        `
        SELECT
          leadServices.serviceId,
          services.serviceName,
          services.programId,
          programs.programName
        FROM leadServices
          INNER JOIN services
            ON services.id = leadServices.serviceId
          INNER JOIN programs
            ON programs.id = services.programId
        WHERE leadServices.leadId = ?;

        SELECT
          leadEvents.eventId,
          events.eventName,
          events.eventLocation,
          events.eventDate
        FROM leadEvents
          INNER JOIN events
            ON events.id = leadEvents.eventId
        WHERE leadEvents.leadId = ?;
      `,
        [lead.leadId, lead.leadId]
      );

      pool.query(getMoreData, (err, results, fields) => {
        if (err) {
          return databaseError(req, res, err);
        }

        let leadServices = [];
        let leadEvents = [];

        if (results[0].length) {
          leadServices = results[0].map(leadService => {
            return {
              id: leadService.serviceId,
              serviceName: leadService.serviceName,
              programId: leadService.programId,
              programName: leadService.programName
            };
          });
        }

        if (results[1].length) {
          leadEvents = results[1].map(leadEvent => {
            return {
              id: leadEvent.eventId,
              eventName: leadEvent.eventName,
              eventLocation: leadEvent.eventLocation,
              eventDate: leadEvent.eventDate
            };
          });
        }

        const leadData = {
          id: lead.leadId,
          dateOfSignUp: responseDateWithoutTime(lead.dateOfSignUp),
          leadStatus: lead.leadStatus === null ? "active" : lead.leadStatus,
          contactStage: {
            first: lead.firstContactAttempt,
            second: lead.secondContactAttempt,
            third: lead.thirdContactAttempt
          },
          inactivityReason: lead.inactivityReason,
          eventSources: leadEvents,
          firstName: lead.firstName,
          lastName: lead.lastName,
          fullName: responseFullName(lead.firstName, lead.lastName),
          phone: lead.phone,
          smsConsent: responseBoolean(lead.smsConsent),
          zip: lead.zip,
          age: lead.age,
          gender: lead.gender,
          leadServices: leadServices,
          clientId: lead.clientId,
          isDeleted: responseBoolean(lead.isDeleted),
          createdBy: {
            userId: lead.addedBy,
            firstName: lead.createdByFirstName,
            lastName: lead.createdByLastName,
            fullName: responseFullName(
              lead.createdByFirstName,
              lead.createdByLastName
            ),
            timestamp: lead.dateAdded
          },
          lastUpdatedBy: {
            userId: lead.modifiedBy,
            firstName: lead.modifiedByFirstName,
            lastName: lead.modifiedByLastName,
            fullName: responseFullName(
              lead.modifiedByFirstName,
              lead.modifiedByLastName
            ),
            timestamp: lead.dateModified
          }
        };

        leads.push(leadData);

        if (leads.length === leadRows.length) {
          res.send({
            leads: [...leads],
            pagination: {
              currentPage: zeroBasedPage + 1,
              pageSize,
              numLeads: totalCount,
              numPages: Math.ceil(totalCount / pageSize)
            }
          });
        }
      });
    });
  });
});
