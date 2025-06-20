const mariadb = require("mariadb/callback.js");
const {
  responseFullName,
  responseDateWithoutTime,
} = require("../../utils/transform-utils");
const { insertTagsQuery } = require("../../tags/tag.utils");

const modifiableLogTypes = [
  "caseNote",
  "clientInteraction:created",
  "clientInteraction:updated",
  "clientInteraction:serviceProvided",
  "follow-up",
];

exports.modifiableLogTypes = modifiableLogTypes;

const skip = Symbol();

exports.insertActivityLogQuery = function (params) {
  if (params.detailIdIsLastInsertId) {
    const data = [
      Number(params.clientId),
      params.title.rawValue ? skip : params.title,
      params.description,
      params.logType,
      params.addedBy,
    ].filter((d) => d !== skip);

    if (params.dateAdded) {
      data.push(params.dateAdded);
    }

    return [
      mariadb.format(
        `
      INSERT INTO clientLogs (clientId, title, description, logType, addedBy, detailId${
        params.dateAdded ? ", dateAdded" : ""
      })
      VALUES (?, ${params.title.rawValue || "?"}, ?, ?, ?, LAST_INSERT_ID()${
          params.dateAdded ? ", ?" : ""
        });

      SET @logId := LAST_INSERT_ID();
    `,
        data
      ),
      ...insertTagsQuery({ rawValue: "@logId" }, "clientLogs", params.tags),
    ];
  } else {
    const data = [
      Number(params.clientId),
      params.title.rawValue ? skip : params.title,
      params.description,
      params.logType,
      params.addedBy,
    ].filter((d) => d !== skip);

    if (params.detailId && !params.detailId.rawValue) {
      data.push(params.detailId);
    }

    if (params.dateAdded) {
      data.push(params.dateAdded);
    }

    let detailIdSql = "";
    if (params.detailId) {
      detailIdSql = ", ";
      detailIdSql += params.detailId.rawValue || "?";
    }

    return [
      mariadb.format(
        `
      INSERT INTO clientLogs (clientId, title, description, logType, addedBy${
        params.detailId ? ", detailId" : ""
      }${params.dateAdded ? ", dateAdded" : ""})
      VALUES (?, ${params.title.rawValue || "?"}, ?, ?, ?${detailIdSql} ${
          params.dateAdded ? ", ?" : ""
        });

      SET @logId := LAST_INSERT_ID();
    `,
        data
      ),
      ...insertTagsQuery({ rawValue: "@logId" }, "clientLogs", params.tags),
    ];
  }
};

const logTypesWithoutTime = ["clientInteraction:serviceProvided", "follow-up"];

exports.createResponseLogObject = function createResponseLogObject(
  log,
  redactedTags = []
) {
  let tags = log.tags || [];
  if (typeof tags === "string") tags = JSON.parse(tags);

  const redact = tags.some((t) => redactedTags.includes(t));
  const doesntHaveTime = logTypesWithoutTime.includes(log.logType);

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
      timestamp: doesntHaveTime
        ? responseDateWithoutTime(log.dateAdded)
        : log.dateAdded,
    },
  };
};
