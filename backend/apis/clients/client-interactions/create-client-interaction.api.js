const { app, databaseError, pool, invalidRequest } = require("../../../server");
const mariadb = require("mariadb/callback.js");
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
const { runQueriesArray } = require("../../utils/mariadb-utils.js");

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

  const getServiceSql = mariadb.format(
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

    const insertQueries = [
      mariadb.format(
        `
        INSERT INTO clientInteractions
        (clientId, serviceId, interactionType, dateOfInteraction, duration, location, addedBy, modifiedBy)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?);

        SET @interactionId := LAST_INSERT_ID();

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
      ),
    ];

    insertQueries.push(
      ...(req.body.customQuestions || []).map((i) =>
        mariadb.format(
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
    );

    insertQueries.push(
      ...insertActivityLogQuery({
        clientId: req.params.clientId,
        title: `${serviceName} service was added to the database`,
        description: req.body.description,
        logType: "clientInteraction:created",
        addedBy: user.id,
        detailId: { rawValue: "@interactionId" },
        tags,
      })
    );

    insertQueries.push(
      ...insertActivityLogQuery({
        clientId: req.params.clientId,
        title: `${serviceName} was provided to the client`,
        description: null,
        logType: "clientInteraction:serviceProvided",
        addedBy: user.id,
        dateAdded: req.body.dateOfInteraction,
        detailId: { rawValue: "@interactionId" },
        tags,
      })
    );

    insertQueries.push(
      ...insertTagsQuery(
        { rawValue: "@interactionId" },
        "clientInteractions",
        tags
      )
    );

    runQueriesArray(insertQueries, (err, result) => {
      if (err) {
        return databaseError(req, res, err);
      }

      getInteraction(
        Number(result[0][0].insertId),
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
