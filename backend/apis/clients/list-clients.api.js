const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql2");
const {
  checkValid,
  nullableValidInteger,
  nullableNonEmptyString,
  nullableValidId,
  nullableValidEnum,
  nullableValidBoolean,
  nullableValidDate,
} = require("../utils/validation-utils");
const {
  responseFullName,
  requestPhone,
  responseBoolean,
  responseDateWithoutTime,
} = require("../utils/transform-utils");

app.get("/api/clients", (req, res, next) => {
  const validationErrors = validateClientListQuery(req.query);

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

  const pageSize = 100;

  const getClientList = clientListQuery(req.query, requestPage, pageSize);

  pool.query(getClientList, function (err, result, fields) {
    if (err) {
      return databaseError(req, res, err);
    }

    const [clientRows, totalCountRows] = result;

    const totalCount = totalCountRows[0]["FOUND_ROWS()"];

    res.send({
      clients: clientRows.map((row) => ({
        id: row.id,
        isDeleted: responseBoolean(row.isDeleted),
        firstName: row.firstName,
        lastName: row.lastName,
        fullName: responseFullName(row.firstName, row.lastName),
        birthday: responseDateWithoutTime(row.birthday),
        address: row.address,
        city: row.city,
        state: row.state,
        zip: row.zip,
        phone: row.primaryPhone,
        email: row.email,
        createdBy: {
          userId: row.addedById,
          firstName: row.addedByFirstName,
          lastName: row.addedByLastName,
          fullName: responseFullName(row.addedByFirstName, row.addedByLastName),
          timestamp: row.dateAdded,
        },
      })),
      pagination: {
        currentPage: requestPage,
        pageSize,
        numClients: totalCount,
        numPages: Math.ceil(totalCount / pageSize),
      },
    });
  });
});

exports.clientListQuery = clientListQuery;
exports.validateClientListQuery = validateClientListQuery;

function clientListQuery(query, pageNum, pageSize) {
  let whereClause = `WHERE isDeleted = false `;
  let whereClauseValues = [];

  if (query.name) {
    whereClause += `AND CONCAT(cl.firstName, ' ', cl.lastName) LIKE ? `;
    whereClauseValues.push(`%${query.name}%`);
  }

  if (query.zip) {
    whereClause += `AND ct.zip = ? `;
    whereClauseValues.push(query.zip);
  }

  if (query.id) {
    whereClause += `AND cl.id = ? `;
    whereClauseValues.push(query.id);
  }

  if (query.phone) {
    whereClause += `AND ct.primaryPhone LIKE ? `;
    whereClauseValues.push("%" + requestPhone(query.phone) + "%");
  }

  let joinIntakeServices = "";
  if (query.programInterest || query.serviceInterest) {
    joinIntakeServices = `
      JOIN 
      latestIntakeData intakeD ON cl.id = intakeD.clientId
    `;
    const serviceId = query.programInterest
      ? `IN (SELECT id FROM services WHERE programId = ?)`
      : "= ?";
    whereClause += `
      AND (SELECT COUNT(*) FROM intakeServices WHERE intakeDataId = intakeD.Id AND intakeServices.serviceId ${serviceId}) > 0
    `;
    whereClauseValues.push(query.programInterest || query.serviceInterest);
  }

  let joinInteractions = "";
  if (query.programInteraction || query.serviceInteraction) {
    const isProgram = Boolean(query.programInteraction);
    const serviceId = isProgram
      ? `IN (SELECT id FROM services WHERE programId = ?)`
      : `= ?`;

    const startDate =
      (isProgram
        ? query.programStartInteraction
        : query.serviceStartInteraction) || "1000-01-01";
    const endDate =
      (isProgram ? query.programEndInteraction : query.serviceEndInteraction) ||
      "3000-01-01";
    const dbId = isProgram
      ? query.programInteraction
      : query.serviceInteraction;

    joinInteractions = mysql.format(
      `
      JOIN (
        SELECT clientId, COUNT(*) numInteractions
        FROM clientInteractions
        WHERE
          clientInteractions.isDeleted = false
          AND
          clientInteractions.dateOfInteraction BETWEEN ? AND ?
          AND
          serviceId ${serviceId}
        GROUP BY clientId
      ) interactionCounts
      ON interactionCounts.clientId = cl.id
    `,
      [startDate, endDate, dbId]
    );

    whereClause += `
      AND interactionCounts.numInteractions > 0
    `;
  }

  if (query.wantsSMS) {
    whereClause += `AND ct.textMessages = TRUE `;
  }

  const sortOrder = query.sortOrder === "desc" ? "DESC" : "ASC";

  let columnsToOrder = `cl.lastName ${sortOrder}, cl.firstName ${sortOrder}`;
  if (query.sortField) {
    columnsToOrder = `cl.${query.sortField} ${sortOrder}`;
  }

  const limitBy = pageNum ? `LIMIT ?, ?` : "";

  let queryString = `
    SELECT SQL_CALC_FOUND_ROWS
      cl.id, cl.firstName, cl.lastName, cl.birthday, cl.isDeleted, ct.email, ct.textMessages,
      ct.zip, ct.primaryPhone, cl.addedBy as addedById, us.firstName as addedByFirstName,
      us.lastname as addedByLastName, cl.dateAdded, ct.address, ct.city, ct.state
    FROM 
      clients cl 
    JOIN
      latestContactInformation ct ON cl.id = ct.clientId
    JOIN
      users us ON cl.addedBy = us.id 
    ${joinIntakeServices}
    ${joinInteractions}
    ${whereClause}
    ORDER BY ${columnsToOrder}
    ${limitBy}
    ;
    
    SELECT FOUND_ROWS();
  `;

  const mysqlValues = [...whereClauseValues];

  if (pageNum) {
    const zeroBasedPage = pageNum ? pageNum - 1 : 0;
    const mysqlOffset = zeroBasedPage * pageSize;
    mysqlValues.push(mysqlOffset, pageSize);
  }

  return mysql.format(queryString, mysqlValues);
}

function validateClientListQuery(query) {
  const validKeys = [
    "page",
    "id",
    "phone",
    "programInterest",
    "serviceInterest",
    "programInteraction",
    "programStartInteraction",
    "programEndInteraction",
    "serviceInteraction",
    "serviceStartInteraction",
    "serviceEndInteraction",
    "sortField",
    "sortOrder",
    "wantsSMS",
    "zip",
    "personType",
    "name",
  ];
  const result = [
    ...checkValid(
      query,
      nullableValidInteger("page"),
      nullableValidId("id"),
      nullableNonEmptyString("phone"),
      nullableValidId("programInterest"),
      nullableValidId("serviceInterest"),
      nullableValidId("programInteraction"),
      nullableValidDate("programStartInteraction"),
      nullableValidDate("programEndInteraction"),
      nullableValidId("serviceInteraction"),
      nullableValidDate("serviceStartInteraction"),
      nullableValidDate("serviceEndInteraction"),
      nullableValidEnum("sortField", "id", "firstName", "lastName", "birthday"),
      nullableValidEnum("sortOrder", "asc", "desc"),
      nullableNonEmptyString("zip"),
      nullableValidBoolean("wantsSMS"),
      nullableNonEmptyString("name")
    ),
    query.programInterest && query.serviceInterest
      ? `You may only provide one of the following query params: 'programInterest' or 'serviceInterest'`
      : null,
    query.programInteraction && query.serviceInteraction
      ? `You may only provide one of the following query params: 'programInteraction' or 'serviceInteraction'`
      : null,
  ].filter(Boolean);

  result.extraKeys = Object.keys(query).filter(
    (key) => !validKeys.includes(key)
  );

  return result;
}
