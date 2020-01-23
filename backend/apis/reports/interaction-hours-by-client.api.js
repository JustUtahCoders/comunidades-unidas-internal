const { app, invalidRequest, pool, databaseError } = require("../../server");
const {
  checkValid,
  nullableValidInteger
} = require("../utils/validation-utils");
const { responseFullName } = require("../utils/transform-utils");
const mysql = require("mysql");

const pageSize = 100;
const sixHoursInSeconds = 6 * 60 * 60;

app.get(`/api/reports/interaction-hours-by-client`, (req, res) => {
  const validationErrors = checkValid(
    req.query,
    nullableValidInteger("minInteractionSeconds")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const oneBasedPage = Number(req.query.page) || 1;
  const zeroBasedPage = oneBasedPage - 1;
  const mysqlOffset = zeroBasedPage * pageSize;

  const minInteractionSeconds =
    Number(req.query.minInteractionSeconds) || sixHoursInSeconds;

  const startDate = req.query.start || "2000-01-01T0";
  const endDate = req.query.end || "3000-01-01T0";

  const sql = mysql.format(
    `
      SELECT SQL_CALC_FOUND_ROWS clients.id, clients.firstName, clients.lastName, clients.gender, clients.birthday, SEC_TO_TIME(clientHours.totalInteractionSeconds) totalDuration, clientHours.totalInteractionSeconds, clientHours.numInteractions
      FROM
        clients
        INNER JOIN 
        (
          SELECT clientId, SUM(TIME_TO_SEC(duration)) totalInteractionSeconds, COUNT(*) numInteractions
          FROM clientInteractions
          WHERE
            isDeleted = false
            AND
            dateOfInteraction >= ?
            AND
            dateOfInteraction <= ?
          GROUP BY clientId
        ) clientHours
        ON clients.id = clientHours.clientId
      WHERE
        clientHours.totalInteractionSeconds >= ?
        AND clients.isDeleted = false
      ORDER BY clients.lastName ASC, clients.firstName
      LIMIT ?, ?
      ;

      SELECT FOUND_ROWS();
    `,
    [startDate, endDate, minInteractionSeconds, mysqlOffset, pageSize]
  );

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [clientRows, totalCountRows] = result;

    const totalCount = totalCountRows[0]["FOUND_ROWS()"];

    res.send({
      clients: clientRows.map(c => ({
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        fullName: responseFullName(c.firstName, c.lastName),
        gender: c.gender,
        birthday: c.birthday,
        totalDuration: c.totalDuration,
        totalInteractionSeconds: c.totalInteractionSeconds,
        numInteractions: c.numInteractions
      })),
      pagination: {
        numClients: totalCount,
        currentPage: oneBasedPage,
        pageSize,
        numPages: Math.ceil(totalCount / pageSize)
      },
      reportParameters: {
        start: startDate,
        end: endDate,
        minInteractionSeconds
      }
    });
  });
});
