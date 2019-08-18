const mysql = require("mysql");
const { responseFullName } = require("../../utils/transform-utils");

exports.createResponseInteractionObject = function createResponseInteractionObject(
  log
) {
  return {
    id: log.id,
    title: log.title,
    serviceId: log.serviceId,
    interactionType: log.interactionType,
    description: log.description,
    dateOfInteraction: log.dateOfInteraction,
    duration: log.duration,
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
