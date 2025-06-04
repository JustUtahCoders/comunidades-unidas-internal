const {
  responseFullName,
  responseDateWithoutTime,
} = require("../../utils/transform-utils");
const mariadb = require("mariadb/callback.js");
const {
  pool,
  invalidRequest,
  databaseError,
  notFound,
} = require("../../../server");

function createResponseInteractionObject(log, customQuestionAnswers, redact) {
  return {
    id: log.id,
    serviceId: redact ? null : log.serviceId,
    interactionType: log.interactionType,
    description: redact ? null : log.description,
    dateOfInteraction: responseDateWithoutTime(log.dateOfInteraction),
    duration: redact ? null : log.duration,
    isDeleted: Boolean(log.isDeleted),
    location: log.location,
    redacted: Boolean(redact),
    customQuestions: customQuestionAnswers.map((question) => {
      return {
        id: question.id,
        questionId: question.questionId,
        answer: JSON.parse(question.answer),
      };
    }),
    createdBy: {
      userId: log.createdById,
      firstName: log.createdByFirstName,
      lastName: log.createdByLastName,
      fullName: responseFullName(log.createdByFirstName, log.createdByLastName),
      timestamp: log.dateAdded,
    },
    lastUpdatedBy: {
      userId: log.lastUpdatedById,
      firstName: log.lastUpdatedByFirstName,
      lastName: log.lastUpdatedByLastName,
      fullName: responseFullName(
        log.lastUpdatedByFirstName,
        log.lastUpdatedByLastName
      ),
      timestamp: log.dateUpdated,
    },
  };
}

exports.getInteraction = function getInteraction(
  interactionId,
  clientId,
  errBack,
  redactedTags = []
) {
  const sql = mariadb.format(
    `
      SELECT l.description, l.id logId, i.id, i.clientId, i.serviceId, s.serviceName,
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
        i.id = ?
          AND l.logType IN ("clientInteraction:created", "clientInteraction:updated")
          AND l.isDeleted = false
          AND i.isDeleted = false
      )
      ORDER BY l.dateAdded DESC;

      SELECT questionId, answer, id FROM clientInteractionCustomAnswers WHERE interactionId = ?;
      
      SELECT tags.tag
      FROM tags
      WHERE tags.foreignId = ? AND tags.foreignTable = 'clientInteractions' AND tags.tag IN (${
        redactedTags.length > 0 ? redactedTags.map(() => "?").join(", ") : `123`
      });
    `,
    [interactionId, interactionId, interactionId].concat(redactedTags)
  );

  pool.query(sql, (err, result) => {
    if (err) {
      errBack((req, res) => {
        databaseError(req, res, err);
      });

      return;
    }

    const [
      interactionResult,
      clientInteractionCustomAnswers,
      tagResult,
    ] = result;

    if (interactionResult.length === 0) {
      errBack((req, res) => {
        notFound(res, `No interaction exists with id ${interactionId}`);
      });

      return;
    }

    const row = interactionResult[0];

    if (row.clientId !== clientId) {
      errBack((req, res) => {
        invalidRequest(
          res,
          `Interaction ${interactionId} is not associated with client ${clientId}`
        );
      });

      return;
    }

    const redact = tagResult.length > 0;

    errBack(
      null,
      createResponseInteractionObject(
        row,
        clientInteractionCustomAnswers,
        redact
      ),
      row.serviceName
    );
  });
};
