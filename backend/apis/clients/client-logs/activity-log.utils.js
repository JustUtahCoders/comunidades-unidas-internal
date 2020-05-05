const mysql = require("mysql");
const { responseFullName } = require("../../utils/transform-utils");
const { insertTagsQuery } = require("../../tags/tag.utils");

const modifiableLogTypes = [
  "caseNote",
  "clientInteraction:created",
  "clientInteraction:updated",
  "clientInteraction:serviceProvided",
];

exports.modifiableLogTypes = modifiableLogTypes;

exports.insertActivityLogQuery = function (params) {
  if (params.detailIdIsLastInsertId) {
    return mysql.format(
      `
      INSERT INTO clientLogs (clientId, title, description, logType, addedBy, detailId)
      VALUES (?, ?, ?, ?, ?, LAST_INSERT_ID());

      SET @logId := LAST_INSERT_ID();
      
      ${insertTagsQuery({ rawValue: "@logId" }, "clientLogs", params.tags)}
    `,
      [
        params.clientId,
        params.title,
        params.description,
        params.logType,
        params.addedBy,
      ]
    );
  } else {
    return mysql.format(
      `
      INSERT INTO clientLogs (clientId, title, description, logType, addedBy, detailId)
      VALUES (?, ?, ?, ?, ?, ?);

      SET @logId := LAST_INSERT_ID();
      
      ${insertTagsQuery({ rawValue: "@logId" }, "clientLogs", params.tags)}
    `,
      [
        params.clientId,
        params.title,
        params.description,
        params.logType,
        params.addedBy,
        params.detailId,
      ]
    );
  }
};

exports.createResponseLogObject = function createResponseLogObject(
  log,
  redactedTags = []
) {
  let tags = log.tags || [];
  if (typeof tags === "string") tags = JSON.parse(tags);

  const redact = tags.some((t) => redactedTags.includes(t));

  return {
    id: log.id,
    title: redact ? null : log.title,
    description: redact ? null : log.description,
    logType: log.logType,
    canModify:
      !redact && modifiableLogTypes.some((logType) => logType === log.logType),
    isDeleted: Boolean(log.isDeleted),
    detailId: log.detailId,
    idOfUpdatedLog: log.idOfUpdatedLog,
    redacted: Boolean(redact),
    createdBy: {
      userId: log.createdById,
      firstName: log.createdByFirstName,
      lastName: log.createdByLastName,
      fullName: responseFullName(log.createdByFirstName, log.createdByLastName),
      timestamp: log.dateAdded,
    },
  };
};
