const { app, pool, invalidRequest, databaseError } = require("../../../server");
const mysql = require("mysql");
const {
  checkValid,
  validId,
  nullableValidId,
  nullableValidEnum,
  nullableNonEmptyString,
  nullableValidDate,
  nullableValidTime
} = require("../../utils/validation-utils");
const { atLeastOne } = require("../../utils/patch-utils");
const { getInteraction } = require("./client-interaction.utils");
const { insertActivityLogQuery } = require("../client-logs/activity-log.utils");

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
      nullableNonEmptyString("description"),
      nullableValidDate("dateOfInteraction"),
      nullableValidTime("duration"),
      nullableValidEnum(
        "location",
        "CUOffice",
        "consulateOffice",
        "communityEvent"
      )
    )
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

  getInteraction(
    interactionId,
    clientId,
    (err, existingInteraction, existingInteractionServiceName) => {
      if (err) {
        return err(req, res);
      }

      getServiceName(existingInteractionServiceName, serviceName => {
        const queries = [];

        if (shouldUpdateInteraction) {
          queries.push(
            mysql.format(
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
                existingInteraction.id
              ]
            )
          );
        }

        if (shouldUpdateLog) {
          queries.push(
            insertActivityLogQuery({
              clientId,
              title: `${serviceName} service added`,
              description:
                req.body.description || existingInteraction.description,
              logType: "clientInteraction:updated",
              addedBy: req.session.passport.user.id,
              detailId: existingInteraction.id
            })
          );

          queries.push(
            mysql.format(
              `
            WITH oldLog AS (
              SELECT id FROM clientLogs
              WHERE logType IN ("clientInteraction:created", "clientInteraction:updated")
                AND detailId = ?
              ORDER BY dateAdded DESC
              LIMIT 1, 1
            )

            UPDATE clientLogs
            SET idOfUpdatedLog = LAST_INSERT_ID()
            WHERE id = (SELECT id FROM oldLog);
          `,
              [existingInteraction.id]
            )
          );
        }

        const sql = queries.join("\n");

        pool.query(sql, (err, result) => {
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
      const sql = mysql.format(
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
