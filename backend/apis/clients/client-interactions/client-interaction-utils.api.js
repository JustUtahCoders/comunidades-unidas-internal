const mysql = require("mysql");
const { responseFullName } = require("../../utils/transform-utils");

const modifiableInteractionTypes = [
  "clientInteraction:created",
  "clientInteraction:updated"
];

exports.createResponseInteractionObject = function createResponseInteractionObject(
  log
) {
  return {
    id: log.id,
    title: log.title,
    serviceId: log.serviceId,
    interationType: log.interactionType,
    description: log.description,
    dateOfInteraction: log.dataOfDescription,
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
