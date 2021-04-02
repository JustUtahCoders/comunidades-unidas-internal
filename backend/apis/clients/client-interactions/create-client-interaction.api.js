const { app, databaseError, pool, invalidRequest } = require("../../../server");
const mysql = require("mysql");
const {
  checkValid,
  validId,
  validEnum,
  nullableNonEmptyString,
  validDate,
  validTime,
  validInteger,
  nullableValidTags,
  nullableValidArray,
} = require("../../utils/validation-utils");
const { getInteraction } = require("./client-interaction.utils");
const { insertActivityLogQuery } = require("../client-logs/activity-log.utils");
const { insertTagsQuery, sanitizeTags } = require("../../tags/tag.utils.js");
const _ = require("lodash");

app.post("/api/clients/:clientId/interactions", (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.params, validId("clientId")),
    ...checkValid(req.query, nullableValidTags("tags", user.permissions)),
    ...checkValid(
      req.body,
      validInteger("serviceId"),
      validEnum(
        "interactionType",
        "inPerson",
        "byPhone",
        "workshopTalk",
        "oneOnOneLightTouch",
        "consultation"
      ),
      nullableNonEmptyString("description"),
      validDate("dateOfInteraction"),
      validTime("duration"),
      validEnum("location", "CUOffice", "consulateOffice", "communityEvent"),
      nullableValidArray("customQuestions", (index) => {
        return (customQuestions) => {
          if (_.isNil(customQuestions[index].answer)) {
            return [
              `customQuestions[${index}].answer must not be null or undefined`,
            ];
          }
        };
      })
    ),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const getServiceSql = mysql.format(
    `SELECT serviceName FROM services WHERE id = ?`,
    [req.body.serviceId]
  );

  pool.query(getServiceSql, (err, getServiceResult) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (getServiceResult.length !== 1) {
      return invalidRequest(
        res,
        `No CU service exists with id '${req.body.serviceId}'`
      );
    }

    const serviceName = getServiceResult[0].serviceName;

    const tags = sanitizeTags(req.query.tags);

    const insertSql = mysql.format(
      `
        INSERT INTO clientInteractions
        (clientId, serviceId, interactionType, dateOfInteraction, duration, location, addedBy, modifiedBy)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?);

        SET @interactionId := LAST_INSERT_ID();

        ${(req.body.customQuestions || [])
          .map((i) =>
            mysql.format(
              `
            INSERT INTO clientInteractionCustomAnswers
            (questionId, answer, interactionId)
            VALUES
            (?,?, @interactionId);
      `,
              [
                i.questionId,
                _.isNumber(i.answer) ? i.answer : JSON.stringify(i.answer),
              ]
            )
          )
          .join("\n")}

        ${insertActivityLogQuery({
          clientId: req.params.clientId,
          title: `${serviceName} service was added to the database`,
          description: req.body.description,
          logType: "clientInteraction:created",
          addedBy: user.id,
          detailId: { rawValue: "@interactionId" },
          tags,
        })}

        ${insertActivityLogQuery({
          clientId: req.params.clientId,
          title: `${serviceName} was provided to the client`,
          description: null,
          logType: "clientInteraction:serviceProvided",
          addedBy: user.id,
          dateAdded: req.body.dateOfInteraction,
          detailId: { rawValue: "@interactionId" },
          tags,
        })}

        ${insertTagsQuery(
          { rawValue: "@interactionId" },
          "clientInteractions",
          tags
        )}
      `,
      [
        req.params.clientId,
        req.body.serviceId,
        req.body.interactionType,
        req.body.dateOfInteraction,
        req.body.duration,
        req.body.location,
        user.id,
        user.id,
      ]
    );

    pool.query(insertSql, (err, result) => {
      if (err) {
        return databaseError(req, res, err);
      }

      getInteraction(
        result[0].insertId,
        Number(req.params.clientId),
        (err, interaction) => {
          if (err) {
            return err(req, res);
          }

          res.send(interaction);
        }
      );
    });
  });
});
