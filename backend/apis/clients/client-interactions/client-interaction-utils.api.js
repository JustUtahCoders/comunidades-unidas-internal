const mysql = require("mysql");
const { responseFullName } = require("../../utils/transform-utils");

const modifiableInteractionTypes = [
  "clientInteraction:created",
  "clientInteraction:updated"
];

exports.insertClientInteractionsQuery = function(params) {
  if (params.detailIdIsLastInsertId) {
    //client interactions don't have the detailId, what should this be based around in it's place?
    return mysql.format(
      `
				INSERT INTO clientInteractions (clientId, title, serviceId, interactionType, description, dateOfInteraction, duraction, createdBy, detailId)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, LAST_INSERT_ID());
			`,
      [
        params.clientId,
        params.title,
        params.serviceId,
        params.interactionType,
        params.description,
        params.dateOfInteraction,
        params.duraction,
        params.location,
        params.isDeleted,
        params.createdBy
      ]
    );
  } else {
    return mysql.format(
      `
				INSERT INTO clientLogs (clientId, title, serviceId, interactionType, description, dateOfInteraction, duraction, createdBy, detailId)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
			`,
      [
        params.clientId,
        params.title,
        params.serviceId,
        params.interactionType,
        params.description,
        params.dateOfInteraction,
        params.duraction,
        params.location,
        params.isDeleted,
        params.createdBy
      ]
    );
  }
};

exports.createResponseInteractionObject = function createResponseInteractionObject(
  log
) {
  return {
    id: log.id,
    title: log.title,
    serviceId: log.serviceId,
    interationType: log.interactionType,
    description: log.description,
    dateOfDescription: log.dataOfDescription,
    duration: log.duration,
    canModify: modifiableInteractionTypes.some(
      interactionType => interactionType === log.interactionType
    ),
    isDeleted: Boolean(log.isDeleted),
    createdBy: {
      userId: log.createdById,
      firstName: log.createdByFirstName,
      lastName: log.createdByLastName,
      fullName: responseFullName(log.createdByFirstName, log.createdByLastName),
      timestamp: log.dateAdded
    }
  };
};
