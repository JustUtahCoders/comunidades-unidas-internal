const mysql = require("mysql");
const { responseFullName } = require("../../utils/transform-utils");

const modifiableLogTypes = ["caseNote"];

exports.modifiableLogTypes = modifiableLogTypes;

exports.insertActivityLogQuery = function(params) {
  if (params.detailIdIsLastInsertId) {
    return mysql.format(
      `
      INSERT INTO clientLogs (clientId, title, description, logType, addedBy, detailId)
      VALUES (?, ?, ?, ?, ?, LAST_INSERT_ID());
    `,
      [
        params.clientId,
        params.title,
        params.description,
        params.logType,
        params.addedBy
      ]
    );
  } else {
    return mysql.format(
      `
      INSERT INTO clientLogs (clientId, title, description, logType, addedBy, detailId)
      VALUES (?, ?, ?, ?, ?, ?);
    `,
      [
        params.clientId,
        params.title,
        params.description,
        params.logType,
        params.addedBy,
        params.detailId
      ]
    );
  }
};

exports.createResponseLogObject = function createResponseLogObject(log) {
  return {
    id: log.id,
    title: log.title,
    description: log.description,
    logType: log.logType,
    canModify: modifiableLogTypes.some(logType => logType === log.logType),
    isDeleted: Boolean(log.isDeleted),
    detailId: log.detailId,
    createdBy: {
      userId: log.createdById,
      firstName: log.createdByFirstName,
      lastName: log.createdByLastName,
      fullName: responseFullName(log.createdByFirstName, log.createdByLastName),
      timestamp: log.dateAdded
    }
  };
};
