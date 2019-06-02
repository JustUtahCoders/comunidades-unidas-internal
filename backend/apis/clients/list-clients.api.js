const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");
const {
  checkValid,
  nullableNonEmptyString,
  nullableValidInteger
} = require("../utils/validation-utils");
const { responseFullName } = require("../utils/transform-utils");

app.get("/api/clients", (req, res, next) => {
  const validationErrors = checkValid(req.query, nullableValidInteger("page"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const pageSize = 100;

    let whereClause = `WHERE 1=1 `;
    let whereClauseValues = [];

    if (req.query.name) {
      whereClause += `AND CONCAT(cl.firstName, ' ', cl.lastName) LIKE ? `;
      whereClauseValues.push(`%${req.query.name}%`);
    }

    if (req.query.zip) {
      whereClause += `AND ct.zip = ?`;
      whereClauseValues.push(req.query.zip);
    }

    let queryString = `
      SELECT SQL_CALC_FOUND_ROWS
        cl.id, cl.firstName, cl.lastName, cl.birthday, ct.email,
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
            ON latestCt.latestDateAdded = innerCt.dateAdded
        ) ct ON cl.id = ct.clientId
      JOIN 
        users us ON cl.addedBy = us.id 
      ${whereClause}
      
      ORDER BY cl.lastName, cl.firstName DESC LIMIT ?, ?;
      
      SELECT FOUND_ROWS();
    `;

    const zeroBasedPage = req.query.page ? parseInt(req.query.page) - 1 : 0;
    const mysqlOffset = zeroBasedPage * pageSize;
    const getClientList = mysql.format(queryString, [
      ...whereClauseValues,
      mysqlOffset,
      pageSize
    ]);

    connection.query(getClientList, function(err, result, fields) {
      if (err) {
        return databaseError(req, res, err);
      }

      connection.release();

      const [clientRows, totalCountRows] = result;

      const totalCount = totalCountRows[0]["FOUND_ROWS()"];

      res.send({
        clients: clientRows.map(row => ({
          id: row.id,
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
            fullName: responseFullName(
              row.addedByFirstName,
              row.addedByLastName
            ),
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
});
