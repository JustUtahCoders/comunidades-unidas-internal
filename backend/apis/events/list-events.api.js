const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");
const {
  responseFullName,
  responseBoolean,
  responseDateWithoutTime
} = require("../utils/transform-utils");
const {
  checkValid,
  nullableValidInteger,
  nullableValidEnum
} = require("../utils/validation-utils");

app.get("/api/events", (req, res, next) => {
  const validationErrors = checkValid(
    req.query,
    nullableValidInteger("page"),
    nullableValidEnum(
      "sortField",
      "id",
      "eventName",
      "eventDate",
      "eventLocation",
      "totalAttendance"
    ),
    nullableValidEnum("sortOrder", "asc", "desc")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const requestPage = parseInt(req.query.page);

  let whereClause = `WHERE events.isDeleted = false `;
  let whereClauseValues = [];

  if (requestPage < 1) {
    return invalidRequest(
      res,
      `Invalid page ${0}. Must be an integer greater than or equal to 1`
    );
  }

  const pageSize = 100;

  const sortOrder = req.query.sortOrder === "desc" ? "DESC" : "ASC";

  let columnsToOrder = `events.eventDate ${sortOrder}`;

  if (req.query.sortField) {
    columnsToOrder = `events.${req.query.sortField} ${sortOrder}`;
  }

  const mysqlQuery = `
    SELECT SQL_CALC_FOUND_ROWS
      events.id AS eventId,
      events.eventName,
      events.eventDate,
      events.eventLocation,
      events.totalAttendance,
      events.isDeleted,
      events.dateAdded,
      events.dateModified,
      events.addedBy AS createdByUserId,
      events.modifiedBy AS modifiedByUserId,
      created.firstName AS createdByFirstName,
      created.lastName AS createdByLastName,
      modified.firstName AS modifiedByFirstName,
      modified.lastName AS modifiedByLastName
    FROM events
    INNER JOIN users created ON created.id = events.addedBy
    INNER JOIN users modified ON modified.id = events.modifiedBy
    ${whereClause}
    ORDER BY ${columnsToOrder}
    LIMIT ?, ?;
    SELECT FOUND_ROWS();
    ;
  `;

  const zeroBasedPage = req.query.page ? requestPage - 1 : 0;
  const mysqlOffset = zeroBasedPage * pageSize;
  const getEvents = mysql.format(mysqlQuery, [
    ...whereClauseValues,
    mysqlOffset,
    pageSize
  ]);

  pool.query(getEvents, (err, results) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [eventRows, totalCountRows] = results;

    const totalCount = totalCountRows[0]["FOUND_ROWS()"];

    const mapEventsData = eventRows.map(result => {
      return {
        id: result.eventId,
        eventName: result.eventName,
        eventDate: responseDateWithoutTime(result.eventDate),
        eventLocation: result.eventLocation,
        totalAttendance: result.totalAttendance,
        isDeleted: responseBoolean(result.isDeleted),
        createdBy: {
          userId: result.createdByUserId,
          firstName: result.createdByFirstName,
          lastName: result.createdByLastName,
          fullName: responseFullName(
            result.createdByFirstName,
            result.createdByLastName
          ),
          timestamp: result.dateAdded
        },
        lastUpdatedBy: {
          userId: result.modifiedByUserId,
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
      events: mapEventsData,
      pagination: {
        currentPage: zeroBasedPage + 1,
        pageSize,
        numEvents: totalCount,
        numPages: Math.ceil(totalCount / pageSize)
      }
    });
  });
});
