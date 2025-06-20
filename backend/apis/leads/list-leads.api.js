const { app, databaseError, pool, invalidRequest } = require("../../server");
const mariadb = require("mariadb/callback.js");
const {
  checkValid,
  nullableValidInteger,
  nullableNonEmptyString,
  nullableValidId,
  nullableValidZip,
  nullableValidEnum,
} = require("../utils/validation-utils");
const {
  responseFullName,
  requestPhone,
  responseBoolean,
  responseDateWithoutTime,
} = require("../utils/transform-utils");
const { mariadbArrToJs } = require("../utils/mariadb-utils");

const pageSize = 100;

app.get("/api/leads", (req, res, next) => {
  const validationErrors = validateListLeadsQuery(req.query);

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const requestPage = parseInt(req.query.page);

  if (requestPage < 1) {
    return invalidRequest(
      res,
      `Invalid page ${0}. Must be an integer greater than or equal to 1`
    );
  }

  const getLeads = listLeadsQuery(req.query, req.query.page || 0);

  pool.query(getLeads, (err, results, fields) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const zeroBasedPage = req.query.page ? req.query.page - 1 : 0;

    const [leadRows, totalCountRows] = results;

    const totalCount = totalCountRows[0]["FOUND_ROWS()"];

    res.send({
      leads: leadRows.map((lead) => ({
        id: lead.leadId,
        dateOfSignUp: responseDateWithoutTime(lead.dateOfSignUp),
        leadStatus: lead.leadStatus,
        contactStage: {
          first: lead.firstContactAttempt,
          second: lead.secondContactAttempt,
          third: lead.thirdContactAttempt,
        },
        inactivityReason: lead.inactivityReason,
        eventSources: mariadbArrToJs(lead.eventSources),
        firstName: lead.firstName,
        lastName: lead.lastName,
        fullName: responseFullName(lead.firstName, lead.lastName),
        phone: lead.phone,
        smsConsent: responseBoolean(lead.smsConsent),
        zip: lead.zip,
        age: lead.age,
        gender: lead.gender,
        leadServices: lead.services ?? [],
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
          timestamp: lead.dateAdded,
        },
        lastUpdatedBy: {
          userId: lead.modifiedBy,
          firstName: lead.modifiedByFirstName,
          lastName: lead.modifiedByLastName,
          fullName: responseFullName(
            lead.modifiedByFirstName,
            lead.modifiedByLastName
          ),
          timestamp: lead.dateModified,
        },
      })),
      pagination: {
        currentPage: zeroBasedPage + 1,
        pageSize,
        numLeads: totalCount,
        numPages: Math.ceil(totalCount / pageSize),
      },
    });
  });
});

function validateListLeadsQuery(query) {
  const validKeys = [
    "page",
    "id",
    "phone",
    "zip",
    "programInterest",
    "serviceInterest",
    "event",
    "sortField",
    "sortOrder",
    "status",
    "personType",
    "name",
  ];

  const validationErrors = checkValid(
    query,
    nullableValidInteger("page"),
    nullableValidId("id"),
    nullableNonEmptyString("phone"),
    nullableValidZip("zip"),
    nullableValidId("programInterest"),
    nullableValidId("serviceInterest"),
    nullableValidId("event"),
    nullableValidEnum(
      "sortField",
      "id",
      "firstName",
      "lastName",
      "dateOfSignUp"
    ),
    nullableValidEnum("sortOrder", "asc", "desc"),
    nullableValidEnum("status", "active", "inactive", "convertedToClient"),
    nullableNonEmptyString("name")
  );

  if (query.programInterest && query.serviceInterest) {
    validationErrors.push(
      `You may only provide one of the following query params: 'programInterest' or 'serviceInterest'`
    );
  }

  validationErrors.extraKeys = Object.keys(query).filter(
    (k) => !validKeys.includes(k)
  );

  return validationErrors;
}

function listLeadsQuery(query, pageNum) {
  let whereClause = `WHERE leads.isDeleted = false `;
  let whereClauseValues = [];

  if (query.name) {
    whereClause += `AND CONCAT(leads.firstName, ' ', leads.lastName) LIKE ? `;
    whereClauseValues.push(`%${query.name}%`);
  }

  if (query.zip) {
    whereClause += `AND leads.zip = ? `;
    whereClauseValues.push(query.zip);
  }

  if (query.id) {
    whereClause += `AND leads.id = ? `;
    whereClauseValues.push(Number(query.id));
  }

  if (query.phone) {
    whereClause += `AND leads.phone LIKE ? `;
    whereClauseValues.push("%" + requestPhone(query.phone) + "%");
  }

  if (query.programInterest) {
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
    whereClauseValues.push(query.programInterest);
  }

  if (query.serviceInterest) {
    whereClause += `
      AND (
        SELECT COUNT(*)
        FROM leadServices
        WHERE leadServices.leadId = leads.id
          AND leadServices.serviceId = ?
      ) > 0
    `;
    whereClauseValues.push(query.serviceInterest);
  }

  if (query.event) {
    whereClause += `
      AND (
        SELECT COUNT(*)
        FROM leadEvents
        WHERE leadEvents.leadId = leads.id
          AND leadEvents.eventId IN (
              SELECT id 
              FROM events 
              WHERE eventId = ?
            )
      ) > 0
    `;
    whereClauseValues.push(Number(query.event));
  }

  const sortOrder = query.sortOrder === "desc" ? "DESC" : "ASC";

  let columnsToOrder = `leads.lastName ${sortOrder}, leads.firstName ${sortOrder}`;

  if (query.sortField) {
    columnsToOrder = `leads.${query.sortField} ${sortOrder}`;
  }

  if (query.wantsSMS) {
    whereClause += `
      AND leads.smsConsent = true
    `;
  }

  if (query.leadStatus) {
    whereClause += `
      AND leads.leadStatus = ?
    `;
    whereClauseValues.push(query.leadStatus);
  }

  const paginated = typeof pageNum !== "undefined";

  if (paginated) {
    const zeroBasedPage = pageNum ? pageNum - 1 : 0;
    const mariadbOffset = zeroBasedPage * pageSize;
    whereClauseValues.push(mariadbOffset, pageSize);
  }

  let mariadbQuery = `
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
      servicesForLeads.services,
      eventsForLeads.eventSources,
      created.firstName AS createdByFirstName,
      created.lastName AS createdByLastName,
      modified.firstName AS modifiedByFirstName,
      modified.lastName AS modifiedByLastName
    FROM leads
      INNER JOIN users created 
        ON created.id = leads.addedBy
      INNER JOIN users modified 
        ON modified.id = leads.modifiedBy
      LEFT OUTER JOIN (
        SELECT leadId,
          JSON_ARRAYAGG(services.id) services
        FROM (
          leadServices INNER JOIN services ON services.id = leadServices.serviceId
        )
        GROUP BY leadServices.leadId
      ) servicesForLeads
        ON servicesForLeads.leadId = leads.id
      LEFT OUTER JOIN (
        SELECT leadId, JSON_ARRAYAGG(leadEvents.eventId) eventSources
        FROM leadEvents
        GROUP BY leadEvents.leadId
      ) eventsForLeads
        ON eventsForLeads.leadId = leads.id
    ${whereClause}
    ORDER BY ${columnsToOrder}
    ${paginated ? "LIMIT ?, ?" : ""}
    ;

    SELECT FOUND_ROWS();
  `;

  const getLeads = mariadb.format(mariadbQuery, whereClauseValues);

  return getLeads;
}

exports.validateListLeadsQuery = validateListLeadsQuery;
exports.listLeadsQuery = listLeadsQuery;
