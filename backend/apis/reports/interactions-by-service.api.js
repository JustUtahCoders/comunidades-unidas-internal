const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid, nullableValidDate } = require("../utils/validation-utils");
const mysql = require("mysql");
const _ = require("lodash");
const { toDuration } = require("./report-helpers");

app.get(`/api/reports/interactions-by-service`, (req, res) => {
  const validationErrors = checkValid(
    req.query,
    nullableValidDate("start"),
    nullableValidDate("end")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const startDate = req.query.start || "2000-01-01T0";
  const endDate = req.query.end || "3000-01-01T0";

  const sql = mysql.format(
    `
      -- num interactions per service
      SELECT totalInteractions, services.id serviceId, services.serviceName, programs.id programId, programs.programName
      FROM
        services
        LEFT OUTER JOIN
        (
          SELECT COUNT(*) totalInteractions, serviceId
          FROM clientInteractions
          WHERE isDeleted = false AND dateOfInteraction >= '2000-01-01' AND dateOfInteraction <= '2020-12-31'
          GROUP BY serviceId
        ) numInteractions
        ON services.id = numInteractions.serviceId
        JOIN programs ON programs.id = services.programId
      ;

      -- num clients per service
      SELECT COUNT(DISTINCT clientInteractions.clientId) numClients, clientInteractions.serviceId
      FROM
        clientInteractions
        JOIN clients ON clients.id = clientInteractions.clientId
      WHERE clientInteractions.isDeleted = false AND clients.isDeleted = false AND clientInteractions.dateOfInteraction >= ? AND clientInteractions.dateOfInteraction <= ?
      GROUP BY clientInteractions.serviceId;

      -- num clients per program
      SELECT COUNT(DISTINCT clientInteractions.clientId) numClients, services.programId programId
      FROM
        clientInteractions
        JOIN clients ON clients.id = clientInteractions.clientId
        JOIN services ON services.id = clientInteractions.serviceId
      WHERE clientInteractions.isDeleted = false AND clients.isDeleted = false AND clientInteractions.dateOfInteraction >= ? AND clientInteractions.dateOfInteraction <= ?
      GROUP BY services.programId;

      -- num hours per service
      SELECT clientHours.totalInteractionSeconds, services.id serviceId
      FROM
        services
        INNER JOIN
        (
          SELECT serviceId, SUM(TIME_TO_SEC(duration)) totalInteractionSeconds
          FROM clientInteractions JOIN clients ON clients.id = clientInteractions.clientId
          WHERE
            clientInteractions.isDeleted = false
            AND clients.isDeleted = false
            AND clientInteractions.dateOfInteraction >= ?
            AND clientInteractions.dateOfInteraction <= ?
          GROUP BY serviceId
        ) clientHours
        ON services.id = clientHours.serviceId
      ;

      -- num total clients
      SELECT (COUNT(DISTINCT clientInteractions.clientId) + (SELECT COUNT(DISTINCT followUps.clientId) FROM followUps WHERE followUps.clientId <> clientInteractions.clientId)) numClients
        FROM clientInteractions
        JOIN clients
        ON clients.id = clientInteractions.clientId
      WHERE
        clients.isDeleted = false
        AND clientInteractions.isDeleted = false
        AND clientInteractions.dateOfInteraction >= ?
        AND clientInteractions.dateOfInteraction <= ?
      ;

      -- num of FOLLOW UP hours by service between selected dates
      SELECT services.id serviceId, clientHours.totalFollowUpSeconds
      FROM services
      INNER JOIN (
        SELECT followUpServices.serviceId serviceId, SUM(TIME_TO_SEC(duration)) totalFollowUpSeconds, followUps.dateOfContact dateOfContact
        FROM followUps
          JOIN clients ON clients.id = followUps.clientId
          JOIN followUpServices ON followUpServices.followUpId = followUps.id
        WHERE clients.isDeleted = false
          AND dateOfContact >= ?
          AND dateOfContact <= ?
        GROUP BY followUpServices.serviceId
      ) clientHours
      ON services.id = clientHours.serviceId
      ;

      -- num of follow ups per service
      SELECT totalFollowUps, services.id serviceId, services.serviceName, programs.id programId, programs.programName
      FROM
        services
        LEFT OUTER JOIN
        (
          SELECT COUNT(*) totalFollowUps, serviceId, followUpId
          FROM followUpServices
          JOIN followUps ON followUps.id = followUpId
          WHERE followUps.dateOfContact >= ? AND followUps.dateOfContact <= ?
          GROUP BY serviceId
        ) numFollowUps
      ON services.id = numFollowUps.serviceId
      JOIN programs ON programs.id = services.programId
      ;
    `,
    [
      startDate,
      endDate,
      startDate,
      endDate,
      startDate,
      endDate,
      startDate,
      endDate,
      startDate,
      endDate,
      startDate,
      endDate,
      startDate,
      endDate,
      startDate,
      endDate,
    ]
  );

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [
      serviceInteractions,
      serviceClients,
      programClients,
      serviceHours,
      totalClients,
      serviceHoursByFollowUps,
      serviceFollowUps,
    ] = result;

    const groupedServiceInteractions = _.groupBy(
      serviceInteractions,
      "programId"
    );

    const groupedServiceFollowUps = _.groupBy(serviceFollowUps, "programId");

    console.log(groupedServiceFollowUps, groupedServiceInteractions);

    const programTotals = Object.keys(groupedServiceInteractions).map(
      (programId) => {
        return {
          programId: Number(programId),
          programName: groupedServiceInteractions[programId][0].programName,
          numInteractions: _.sum(
            groupedServiceInteractions[programId].map(
              (s) => s.totalInteractions || 0
            )
          ),
          numClients: 0,
          totalInteractionSeconds: 0,
          totalDuration: "00:00:00",
        };
      }
    );

    const serviceTotals = serviceInteractions.map((service) => ({
      serviceName: service.serviceName,
      programName: service.programName,
      numInteractions: service.totalInteractions || 0,
      numClients: 0,
      totalInteractionSeconds: 0,
      totalDuration: "00:00:00",
      serviceId: service.serviceId,
      programId: service.programId,
    }));

    const followUpServicesTotal = serviceClients.forEach((serviceRow) => {
      const service = serviceTotals.find(
        (s) => s.serviceId === serviceRow.serviceId
      );
      service.numClients = serviceRow.numClients;
    });

    programClients.forEach((programRow) => {
      const program = programTotals.find(
        (p) => p.programId === programRow.programId
      );
      program.numClients = programRow.numClients;
    });

    serviceHours.forEach((serviceHour) => {
      const service = serviceTotals.find(
        (s) => s.serviceId === serviceHour.serviceId
      );
      service.totalInteractionSeconds = serviceHour.totalInteractionSeconds;
      service.totalDuration = toDuration(serviceHour.totalInteractionSeconds);

      const program = programTotals.find(
        (p) => p.programId === service.programId
      );
      program.totalInteractionSeconds += serviceHour.totalInteractionSeconds;
    });

    // serviceFollowUps.forEach((serviceHour) => {
    //   const service =
    // });

    programTotals.forEach((program) => {
      program.totalDuration = toDuration(program.totalInteractionSeconds);
    });

    const grandTotal = {
      numInteractions: _.sum(programTotals.map((p) => p.numInteractions)),
      numClients: totalClients[0].numClients,
      totalInteractionSeconds: _.sum(
        programTotals.map((p) => p.totalInteractionSeconds)
      ),
    };
    grandTotal.totalDuration = toDuration(grandTotal.totalInteractionSeconds);

    res.send({
      grandTotal,
      programs: programTotals,
      services: serviceTotals,
      followUpServicesTotal: followUpServicesTotal,
      reportParameters: {
        start: req.query.start || null,
        end: req.query.end || null,
      },
    });
  });
});
