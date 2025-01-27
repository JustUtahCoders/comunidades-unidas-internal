const { app, invalidRequest, pool, databaseError } = require("../../server");
const {
  checkValid,
  nullableValidInteger,
  nullableValidBoolean,
  nullableValidDate,
} = require("../utils/validation-utils");
const { responseFullName } = require("../utils/transform-utils");
const mysql = require("mysql2");
const { toDuration } = require("./report-helpers");

const pageSize = 100;
const sixHoursInSeconds = 6 * 60 * 60;
const tenThousandHoursInSeconds = 10000 * 60 * 60;

app.get(`/api/reports/interaction-hours-by-client`, (req, res) => {
  const validationErrors = checkValid(
    req.query,
    nullableValidInteger("minInteractionSeconds"),
    nullableValidInteger("maxInteractionSeconds"),
    nullableValidBoolean("minInclusive"),
    nullableValidBoolean("maxInclusive"),
    nullableValidDate("start"),
    nullableValidDate("end")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const oneBasedPage = Number(req.query.page) || 1;
  const zeroBasedPage = oneBasedPage - 1;
  const mysqlOffset = zeroBasedPage * pageSize;
  const minInclusive = req.query.minInclusive === "true";
  const maxInclusive = req.query.maxInclusive === "true";

  const minInteractionSeconds = Number(req.query.minInteractionSeconds) || 0;

  const maxInteractionSeconds =
    Number(req.query.maxInteractionSeconds) || tenThousandHoursInSeconds;

  const startDate = req.query.start || "2000-01-01T0";
  const endDate = req.query.end || "3000-01-01T0";

  const sql = mysql.format(
    `
      SELECT SQL_CALC_FOUND_ROWS clients.id, clients.firstName, clients.lastName, clients.gender, clients.birthday, clientHours.totalInteractionSeconds, clientHours.numInteractions, contactInfo.primaryPhone
      FROM
        clients
        INNER JOIN 
        (
          SELECT clientId, SUM(TIME_TO_SEC(duration)) totalInteractionSeconds, COUNT(*) numInteractions
          FROM clientInteractions
          WHERE
            isDeleted = false
            AND
            dateOfInteraction BETWEEN ? AND ?
          GROUP BY clientId
        ) clientHours
        ON clients.id = clientHours.clientId
        INNER JOIN latestContactInformation contactInfo ON contactInfo.clientId = clients.id
      WHERE
        clientHours.totalInteractionSeconds >${minInclusive ? "=" : ""} ?
        AND clientHours.totalInteractionSeconds <${maxInclusive ? "=" : ""} ?
        AND clients.isDeleted = false
      ORDER BY clients.lastName ASC, clients.firstName
      LIMIT ?, ?
      ;

      SELECT FOUND_ROWS();
    `,
    [
      startDate,
      endDate,
      minInteractionSeconds,
      maxInteractionSeconds,
      mysqlOffset,
      pageSize,
    ]
  );

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [clientRows, totalCountRows] = result;

    const totalCount = totalCountRows[0]["FOUND_ROWS()"];

    res.send({
      clients: clientRows.map((c) => ({
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        fullName: responseFullName(c.firstName, c.lastName),
        gender: c.gender,
        birthday: c.birthday,
        totalDuration: toDuration(c.totalInteractionSeconds),
        totalInteractionSeconds: c.totalInteractionSeconds,
        numInteractions: c.numInteractions,
        primaryPhone: c.primaryPhone,
      })),
      pagination: {
        numClients: totalCount,
        currentPage: oneBasedPage,
        pageSize,
        numPages: Math.ceil(totalCount / pageSize),
      },
      reportParameters: {
        start: req.query.start || null,
        end: req.query.end || null,
        minInteractionSeconds: req.query.minInteractionSeconds || null,
        minInclusive,
        maxInteractionSeconds: req.query.maxInteractionSeconds || null,
        maxInclusive,
      },
    });
  });
});
