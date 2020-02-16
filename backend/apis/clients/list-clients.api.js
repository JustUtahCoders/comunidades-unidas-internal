const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");
const {
  checkValid,
  nullableValidInteger,
  nullableNonEmptyString,
  nullableValidId,
  nullableValidEnum,
  nullableValidBoolean
} = require("../utils/validation-utils");
const {
  responseFullName,
  requestPhone,
  responseBoolean,
  responseDateWithoutTime
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

  if (req.query.program && req.query.service) {
    return invalidRequest(
      res,
      `You may only provide one of the following query params: 'program' or 'service'`
    );
  }

  const pageSize = 100;

  const getClientList = clientListQuery(req.query, requestPage, pageSize);

  pool.query(getClientList, function(err, result, fields) {
    if (err) {
      return databaseError(req, res, err);
    }

    const [clientRows, totalCountRows] = result;

    const totalCount = totalCountRows[0]["FOUND_ROWS()"];

    res.send({
      clients: clientRows.map(row => ({
        id: row.id,
        isDeleted: responseBoolean(row.isDeleted),
        firstName: row.firstName,
        lastName: row.lastName,
        fullName: responseFullName(row.firstName, row.lastName),
        birthday: responseDateWithoutTime(row.birthday),
        zip: row.zip,
        phone: row.primaryPhone,
        email: row.email,
        createdBy: {
          userId: row.addedById,
          firstName: row.addedByFirstName,
          lastName: row.addedByLastName,
          fullName: responseFullName(row.addedByFirstName, row.addedByLastName),
          timestamp: row.dateAdded
        }
      })),
      pagination: {
        currentPage: requestPage,
        pageSize,
        numClients: totalCount,
        numPages: Math.ceil(totalCount / pageSize)
      }
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
  if (query.program || query.service) {
    joinIntakeServices = `
      JOIN 
      (
        SELECT id intakeDId, clientId
        FROM
          intakeData innerIntakeD
          JOIN
          (
            SELECT clientId latestClientId, MAX(dateAdded) latestDateAdded
            FROM intakeData GROUP BY clientId
          ) latestIntakeD
          ON latestIntakeD.latestDateAdded = innerIntakeD.dateAdded AND latestIntakeD.latestClientId = innerIntakeD.clientId
      ) intakeD ON cl.id = intakeD.clientId
    `;
    const serviceId = query.program
      ? `IN (SELECT id FROM services WHERE programId = ?)`
      : "= ?";
    whereClause += `
      AND (SELECT COUNT(*) FROM intakeServices WHERE intakeDataId = intakeDId AND intakeServices.serviceId ${serviceId}) > 0
    `;
    whereClauseValues.push(query.program || query.service);
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
      cl.id, cl.firstName, cl.lastName, cl.birthday, cl.isDeleted, ct.email, 
      ct.zip, ct.primaryPhone, cl.addedBy as addedById, us.firstName as addedByFirstName,
      us.lastname as addedByLastName, cl.dateAdded
    FROM 
      clients cl 
    JOIN 
      (
        SELECT *
        FROM
          contactInformation innerCt
          JOIN
          (
            SELECT clientId latestClientId, MAX(dateAdded) latestDateAdded
            FROM contactInformation GROUP BY clientId
          ) latestCt
          ON latestCt.latestDateAdded = innerCt.dateAdded AND latestCt.latestClientId = innerCt.clientId
      ) ct ON cl.id = ct.clientId
    JOIN 
      users us ON cl.addedBy = us.id 
    ${joinIntakeServices}
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
  return checkValid(
    query,
    nullableValidInteger("page"),
    nullableValidId("id"),
    nullableNonEmptyString("phone"),
    nullableValidId("program"),
    nullableValidEnum("sortField", "id", "firstName", "lastName", "birthday"),
    nullableValidEnum("sortOrder", "asc", "desc"),
    nullableValidBoolean("wantsSMS")
  );
}
