const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound,
} = require("../../server");
const mariadb = require("mariadb/callback.js");
const { checkValid, validId } = require("../utils/validation-utils");
const {
  responseFullName,
  responseBoolean,
  responseDateWithoutTime,
  defaultZero,
} = require("../utils/transform-utils");
const _ = require("lodash");

app.get("/api/events/:id", (req, res, next) => {
  const validationErrors = checkValid(req.params, validId("id"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  getEventById(req.params.id, (err, event) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (event) {
      res.send(event);
    } else {
      notFound(res, `Could not find event with id ${req.params.id}`);
    }
  });
});

exports.getEventById = getEventById;

function getEventById(eventId, cbk, connection) {
  eventId = Number(eventId);

  const getEvent = mariadb.format(
    `
      SELECT
        events.id AS eventId,
        events.eventName,
        events.eventDate,
        events.eventLocation,
        events.attendanceMale,
        events.attendanceFemale,
        events.attendanceOther,
        events.attendanceUnknown,
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
      WHERE events.id = ? AND isDeleted = false;

      SELECT
        leadEvents.leadId, leads.gender, leads.leadStatus, leads.firstName, leads.lastName
      FROM leadEvents JOIN leads ON leads.id = leadEvents.leadId
      WHERE leadEvents.eventId = ? AND leads.isDeleted = false;

      SELECT materials.id, materials.name, eventMaterials.quantityDistributed
      FROM materials LEFT JOIN eventMaterials ON materials.id = eventMaterials.materialId
      WHERE eventMaterials.eventId = ? AND materials.isDeleted = false
      ORDER BY materials.name ASC
      ;
    `,
    [eventId, eventId, eventId]
  );

  (connection || pool).query(getEvent, (err, data, fields) => {
    if (err) {
      return cbk(err, data, fields);
    }

    if (data.length === 0) {
      return cbk(err, null);
    }

    const e = data[0][0];
    const leadResult = data[1];
    const materialsResult = data[2];
    const [eventLeads, eventClients] = _.partition(
      leadResult,
      (r) => r.leadStatus !== "convertedToClient"
    );

    const leadGenders = _.groupBy(eventLeads, "gender");
    const leadGenderCounts = Object.keys(leadGenders).reduce(
      (result, gender) => {
        result[gender] = leadGenders[gender].length;
        return result;
      },
      {}
    );

    const leads = eventLeads.map((lead) => {
      return {
        leadId: lead.leadId,
        firstName: lead.firstName,
        lastName: lead.lastName,
        fullName: responseFullName(lead.firstName, lead.lastName),
      };
    });

    const clientGenders = _.groupBy(eventClients, "gender");
    const clientGenderCounts = Object.keys(clientGenders).reduce(
      (result, gender) => {
        result[gender] = clientGenders[gender].length;
        return result;
      },
      {}
    );

    const attendanceMale = defaultZero(e.attendanceMale),
      attendanceFemale = defaultZero(e.attendanceFemale),
      attendanceOther = defaultZero(e.attendanceOther),
      attendanceUnknown = defaultZero(e.attendanceUnknown);

    const totalAttendance =
      attendanceFemale + attendanceMale + attendanceOther + attendanceUnknown;

    const event = {
      id: e.eventId,
      eventName: e.eventName,
      eventDate: responseDateWithoutTime(e.eventDate),
      eventLocation: e.eventLocation,
      totalAttendance,
      attendanceMale,
      attendanceFemale,
      attendanceOther,
      attendanceUnknown,
      totalLeads: eventLeads.length,
      totalConvertedToClients: eventClients.length,
      leadGenders: leadGenderCounts,
      clientGenders: clientGenderCounts,
      isDeleted: responseBoolean(e.isDeleted),
      materialsDistributed: materialsResult.map((row) => ({
        materialId: row.id,
        name: row.name,
        quantityDistributed: row.quantityDistributed,
      })),
      createdBy: {
        userId: e.createdByUserId,
        firstName: e.createdByFirstName,
        lastName: e.createdByLastName,
        fullName: responseFullName(e.createdByFirstName, e.createdByLastName),
        timestamp: e.dateAdded,
      },
      lastUpdatedBy: {
        userId: e.modifiedByUserId,
        firstName: e.modifiedByFirstName,
        lastName: e.modifiedByLastName,
        fullName: responseFullName(e.modifiedByFirstName, e.modifiedByLastName),
        timestamp: e.dateModified,
      },
      leads,
    };

    cbk(err, event);
  });
}
