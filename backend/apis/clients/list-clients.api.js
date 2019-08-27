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
  responseBoolean
} = require("../utils/transform-utils");

app.get("/api/clients", (req, res, next) => {
  const validationErrors = checkValid(
    req.query,
    nullableValidInteger("page"),
    nullableValidId(),
    nullableNonEmptyString("phone")
  );

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

  let whereClause = `WHERE isDeleted = false `;
  let whereClauseValues = [];

  if (req.query.name) {
    whereClause += `AND CONCAT(cl.firstName, ' ', cl.lastName) LIKE ? `;
    whereClauseValues.push(`%${req.query.name}%`);
  }

  if (req.query.zip) {
    whereClause += `AND ct.zip = ? `;
    whereClauseValues.push(req.query.zip);
  }

  if (req.query.id) {
    whereClause += `AND cl.id = ? `;
    whereClauseValues.push(req.query.id);
  }

  if (req.query.phone) {
    whereClause += `AND ct.primaryPhone LIKE ? `;
    whereClauseValues.push("%" + requestPhone(req.query.phone) + "%");
  }

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
    ${whereClause}
    
    ORDER BY cl.lastName, cl.firstName DESC LIMIT ?, ?;
    
    SELECT FOUND_ROWS();
  `;

  const zeroBasedPage = req.query.page ? requestPage - 1 : 0;
  const mysqlOffset = zeroBasedPage * pageSize;
  const getClientList = mysql.format(queryString, [
    ...whereClauseValues,
    mysqlOffset,
    pageSize
  ]);

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
        birthday: row.birthday,
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
        currentPage: zeroBasedPage + 1,
        pageSize,
        numClients: totalCount,
        numPages: Math.ceil(totalCount / pageSize)
      }
    });
  });
});
