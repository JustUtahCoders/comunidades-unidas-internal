const {
  responseFullName,
  responseDateWithoutTime
} = require("../../utils/transform-utils");
const mysql = require("mysql");
const { pool } = require("../../../server");

function createResponseInteractionObject(log) {
  return {
    id: log.id,
    serviceId: log.serviceId,
    interactionType: log.interactionType,
    description: log.description,
    dateOfInteraction: responseDateWithoutTime(log.dateOfInteraction),
    duration: log.duration,
    isDeleted: Boolean(log.isDeleted),
    location: log.location,
    createdBy: {
      userId: log.createdById,
      firstName: log.createdByFirstName,
      lastName: log.createdByLastName,
      fullName: responseFullName(log.createdByFirstName, log.createdByLastName),
      timestamp: log.dateAdded
    },
    lastUpdatedBy: {
      userId: log.lastUpdatedById,
      firstName: log.lastUpdatedByFirstName,
      lastName: log.lastUpdatedByLastName,
      fullName: responseFullName(
        log.lastUpdatedByFirstName,
        log.lastUpdatedByLastName
      ),
      timestamp: log.dateUpdated
    }
  };
}

exports.getInteraction = function getInteraction(
  interactionId,
  clientId,
  errBack
) {
  const sql = mysql.format(
    `
      SELECT l.description, i.id, i.clientId, i.serviceId, s.serviceName,
        i.interactionType, i.dateOfInteraction, i.duration,
        i.location, i.dateAdded, i.addedBy createdById, i.dateModified dateUpdated, i.modifiedBy lastUpdatedById,
        addedByUsers.firstName createdByFirstName, addedByUsers.lastName createdByLastName,
        modifiedByUsers.firstName lastUpdatedByFirstName, modifiedByUsers.lastName lastUpdatedByLastName
      FROM
        clientInteractions i
        JOIN clientLogs l ON l.detailId = i.id
        JOIN users addedByUsers ON addedByUsers.id = i.addedBy
        JOIN users modifiedByUsers ON modifiedByUsers.id = i.modifiedBy
        JOIN services s ON s.id = i.serviceId
      WHERE (
        i.id = ? AND
        l.logType IN ("clientInteraction:created", "clientInteraction:deleted") AND
        l.isDeleted = false AND
        i.isDeleted = false
      )
      ORDER BY l.dateAdded DESC
      LIMIT 1
    `,
    [interactionId]
  );

  pool.query(sql, (err, result) => {
    if (err) {
      errBack((req, res) => {
        databaseError(req, res, err);
      });

      return;
    }

    if (result.length === 0) {
      errBack((req, res) => {
        res
          .status(404)
          .send({ error: `No interaction exists with id ${interactionId}` });
      });

      return;
    }

    const row = result[0];

    if (row.clientId !== clientId) {
      errBack((req, res) => {
        invalidRequest(
          res,
          `Interaction ${interactionId} is not for client ${clientId}`
        );
      });

      return;
    }

    errBack(null, createResponseInteractionObject(row), row.serviceName);
  });
};
