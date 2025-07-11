const { app, pool, invalidRequest, databaseError } = require("../../../server");
const mariadb = require("mariadb/callback.js");
const {
  checkValid,
  validId,
  nullableValidId,
  nullableValidEnum,
  nullableNonEmptyString,
  nullableValidDate,
  nullableValidTime,
  nullableValidTags,
  nullableValidArray,
} = require("../../utils/validation-utils");
const { atLeastOne } = require("../../utils/patch-utils");
const { getInteraction } = require("./client-interaction.utils");
const { insertActivityLogQuery } = require("../client-logs/activity-log.utils");
const { sanitizeTags, insertTagsQuery } = require("../../tags/tag.utils");
const _ = require("lodash");
const { runQueriesArray } = require("../../utils/mariadb-utils.js");

app.patch("/api/clients/:clientId/interactions/:interactionId", (req, res) => {
  const validationErrors = [
    ...checkValid(req.params, validId("clientId"), validId("interactionId")),
    ...checkValid(
      req.body,
      nullableValidId("serviceId"),
      nullableValidEnum(
        "interactionType",
        "inPerson",
        "byPhone",
        "workshopTalk",
        "oneOnOneLightTouch",
        "consultation"
      ),
      nullableValidArray("customQuestions", (index) => {
        return (customQuestions) => {
          if (_.isNil(customQuestions[index].answer)) {
            return [
              `customQuestions[${index}].answer must not be null or undefined`,
            ];
          }
        };
      }),
      nullableNonEmptyString("description"),
      nullableValidDate("dateOfInteraction"),
      nullableValidTime("duration"),
      nullableValidEnum(
        "location",
        "CUOffice",
        "consulateOffice",
        "communityEvent"
      )
    ),

    ...checkValid(
      req.query,
      nullableValidTags("tags", req.session.passport.user.permissions)
    ),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const shouldUpdateInteraction = atLeastOne(
    req.body,
    "serviceId",
    "interactionType",
    "dateOfInteraction",
    "duration",
    "location"
  );

  const shouldUpdateLog = atLeastOne(req.body, "description");

  if (!shouldUpdateInteraction && !shouldUpdateLog) {
    return invalidRequest(
      res,
      `Patching a client interaction requires one of the following properties in the request body: serviceId, interactionType, dateOfInteraction, duration, location, description`
    );
  }

  const interactionId = Number(req.params.interactionId);
  const clientId = Number(req.params.clientId);
  const tags = sanitizeTags(req.query.tags);

  getInteraction(
    interactionId,
    clientId,
    (err, existingInteraction, existingInteractionServiceName) => {
      if (err) {
        return err(req, res);
      }

      getServiceName(existingInteractionServiceName, (serviceName) => {
        const queries = [];

        if (shouldUpdateInteraction) {
          queries.push(
            mariadb.format(
              `
            UPDATE clientInteractions
            SET serviceId = ?,
              interactionType = ?,
              dateOfInteraction = ?,
              duration = ?,
              location = ?,
              modifiedBy = ?
              
            WHERE id = ?;
          `,
              [
                Number(req.body.serviceId) || existingInteraction.serviceId,
                req.body.interactionType || existingInteraction.interactionType,
                req.body.dateOfInteraction ||
                  existingInteraction.dateOfInteraction,
                req.body.duration || existingInteraction.duration,
                req.body.location || existingInteraction.location,
                req.session.passport.user.id,
                existingInteraction.id,
              ]
            )
          );

          if (tags.length > 0) {
            queries.push(
              ...insertTagsQuery(
                existingInteraction.id,
                "clientInteractions",
                tags
              )
            );
          }
        }

        if (shouldUpdateLog) {
          queries.push(
            ...insertActivityLogQuery({
              clientId,
              title: `${serviceName} service added`,
              description:
                req.body.description || existingInteraction.description,
              logType: "clientInteraction:updated",
              addedBy: req.session.passport.user.id,
              detailId: existingInteraction.id,
              tags,
            })
          );

          queries.push(
            mariadb.format(
              `
            UPDATE clientLogs
            SET idOfUpdatedLog = @logId
            WHERE id = (
              SELECT id FROM clientLogs
              WHERE logType IN ("clientInteraction:created", "clientInteraction:updated")
                AND detailId = ?
              ORDER BY dateAdded DESC
              LIMIT 1, 1
            );
          `,
              [existingInteraction.id]
            )
          );
        }

        if (req.body.dateOfInteraction) {
          queries.push(
            ...insertActivityLogQuery({
              clientId,
              title: `${serviceName} service was provided`,
              description: null,
              logType: "clientInteraction:serviceProvided",
              addedBy: req.session.passport.user.id,
              detailId: existingInteraction.id,
              tags,
            })
          );

          queries.push(
            mariadb.format(
              `
            UPDATE clientLogs
            SET idOfUpdatedLog = @logId
            WHERE id = (
              SELECT id FROM clientLogs
              WHERE logType = 'clientInteraction:serviceProvided'
                AND detailId = ?
              ORDER BY id DESC
              LIMIT 1
            );
          `,
              [existingInteraction.id]
            )
          );
        }

        if (req.body.hasOwnProperty("customQuestions")) {
          const deleteQuery = mariadb.format(
            `
            DELETE from clientInteractionCustomAnswers where interactionId = ?;
            `,
            [interactionId]
          );
          queries.push(deleteQuery);
          const createCustomAnswerQueries = req.body.customQuestions.map(
            (question) =>
              mariadb.format(
                `
                  INSERT INTO clientInteractionCustomAnswers (questionId, answer, interactionId) 
                  VALUES(?,?,?);
            `,
                [
                  question.questionId,
                  _.isNumber(question.answer)
                    ? question.answer
                    : JSON.stringify(question.answer),
                  interactionId,
                ]
              )
          );
          queries.push(...createCustomAnswerQueries);
        }

        runQueriesArray(queries, (err, result) => {
          if (err) {
            return databaseError(req, res, err);
          }

          getInteraction(interactionId, clientId, (err, result) => {
            if (err) {
              return err(req, res);
            }

            res.send(result);
          });
        });
      });
    }
  );

  function getServiceName(existingServiceName, callback) {
    if (req.body.serviceId) {
      const sql = mariadb.format(
        `SELECT serviceName FROM services WHERE id = ?`,
        [req.body.serviceId]
      );
      pool.query(sql, (err, result) => {
        if (err) {
          return databaseError(req, res, err);
        }

        if (result.length !== 1) {
          return invalidRequest(
            res,
            `No such CU service with id ${req.body.serviceId}`
          );
        }

        callback(result[0].serviceName);
      });
    } else {
      callback(existingServiceName);
    }
  }
});
