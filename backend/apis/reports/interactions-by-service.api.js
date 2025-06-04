const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid, nullableValidDate } = require("../utils/validation-utils");
const mariadb = require("mariadb");
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

  const sql = mariadb.format(
    `
      -- num interactions per service
      SELECT totalInteractions, services.id serviceId, services.serviceName, programs.id programId, programs.programName
      FROM
        services
        LEFT OUTER JOIN
        (
          SELECT COUNT(*) totalInteractions, serviceId
          FROM clientInteractions
          WHERE isDeleted = false AND (dateOfInteraction BETWEEN ? AND ?)
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
      WHERE clientInteractions.isDeleted = false AND clients.isDeleted = false AND (clientInteractions.dateOfInteraction BETWEEN ? AND ?)
      GROUP BY clientInteractions.serviceId;

      -- num clients per program
      SELECT COUNT(DISTINCT clientInteractions.clientId) numClients, services.programId programId
      FROM
        clientInteractions
        JOIN clients ON clients.id = clientInteractions.clientId
        JOIN services ON services.id = clientInteractions.serviceId
      WHERE clientInteractions.isDeleted = false AND clients.isDeleted = false AND (clientInteractions.dateOfInteraction BETWEEN ? AND ?)
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
            AND (clientInteractions.dateOfInteraction BETWEEN ? AND ?)
          GROUP BY serviceId
        ) clientHours
        ON services.id = clientHours.serviceId
      ;

      -- num total clients
      SELECT COUNT(clientId) numClients
      FROM (
        SELECT DISTINCT clientId
        FROM clientInteractions
        JOIN clients ON clients.id = clientInteractions.clientId
        WHERE clients.isDeleted = false
        AND (clientInteractions.dateOfInteraction BETWEEN ? AND ?)
        UNION
        SELECT DISTINCT clientId
        FROM followUps
        JOIN clients ON clients.id = followUps.clientId
        WHERE clients.isDeleted = false
        AND (followUps.dateOfContact BETWEEN ? AND ?)
      ) totalClients;

      -- num of FOLLOW UP hours by service between selected dates
      SELECT services.id serviceId, clientHours.totalFollowUpSeconds
      FROM services
      INNER JOIN (
        SELECT followUpServices.serviceId serviceId, SUM(TIME_TO_SEC(duration)) totalFollowUpSeconds, followUps.dateOfContact dateOfContact
        FROM followUps
          JOIN clients ON clients.id = followUps.clientId
          JOIN followUpServices ON followUpServices.followUpId = followUps.id
        WHERE clients.isDeleted = false
          AND (dateOfContact BETWEEN ? AND ?)
        GROUP BY followUpServices.serviceId
      ) clientHours
      ON services.id = clientHours.serviceId
      ;

      -- unspecified follow ups (unassociated with a program) between selected dates
      SELECT id, TIME_TO_SEC(duration) followUpSeconds
      FROM followUps
      WHERE (dateOfContact BETWEEN ? AND ?)
        AND id NOT IN
          (SELECT followUpId 
          FROM followUpServices)
      ;

      -- all follow ups, including those not associated with a program, between selected dates
      SELECT COUNT(*) totalFollowUps, SUM(TIME_TO_SEC(duration)) totalFollowUpSeconds
      FROM followUps
      WHERE (dateOfContact BETWEEN ? AND ?)
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
          WHERE (followUps.dateOfContact BETWEEN ? AND ?)
          GROUP BY serviceId
        ) numFollowUps
      ON services.id = numFollowUps.serviceId
      JOIN programs ON programs.id = services.programId
      ;

      -- num of clients per follow up per program
      SELECT COUNT(DISTINCT followUps.clientId) numClients, services.programId programId
      FROM
        followUps
        JOIN clients ON clients.id = followUps.clientId
        JOIN followUpServices ON followUpServices.followUpId = followUps.id
        JOIN services ON services.id = followUpServices.serviceId
      WHERE clients.isDeleted = false AND (followUps.dateOfContact BETWEEN ? AND ?)
      GROUP BY services.programId;

      -- num of clients for follow ups per service
      SELECT COUNT(DISTINCT followUps.clientId) numClients, followUpServices.serviceId
      FROM followUps
      JOIN clients ON clients.id = followUps.clientId
      JOIN followUpServices ON followUps.id = followUpServices.followUpId
      WHERE clients.isDeleted = false
        AND (followUps.dateOfContact BETWEEN ? AND ?)
      GROUP BY followUpServices.serviceId;
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
      unspecifiedFollowUps,
      allFollowUps,
      serviceFollowUps,
      programFollowUpClients,
      serviceFollowUpClients,
    ] = result;

    const groupedServiceInteractions = _.groupBy(
      serviceInteractions,
      "programId"
    );

    const groupedServiceFollowUps = _.groupBy(serviceFollowUps, "programId");

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

    const followUpProgramTotals = Object.keys(groupedServiceFollowUps).map(
      (programId) => ({
        programId: Number(programId),
        programName: groupedServiceFollowUps[programId][0].programName,
        numFollowUps: _.sum(
          groupedServiceFollowUps[programId].map((s) => s.totalFollowUps || 0)
        ),
        numClients: 0,
        totalFollowUpSeconds: 0,
        totalDuration: "00:00:00",
      })
    );

    const unspecifiedFollowUpTotals = {
      numFollowUps: unspecifiedFollowUps.length,
      totalSeconds: _.sum(
        unspecifiedFollowUps.map((followUp) => followUp.followUpSeconds)
      ),
    };
    unspecifiedFollowUpTotals.totalDuration = toDuration(
      unspecifiedFollowUpTotals.totalSeconds
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

    const followUpServicesTotal = serviceFollowUps.map((service) => ({
      serviceName: service.serviceName,
      programName: service.programName,
      numFollowUps: service.totalFollowUps || 0,
      numClients: 0,
      totalFollowUpSeconds: 0,
      totalDuration: "00:00:00",
      serviceId: service.serviceId,
      programId: service.programId,
    }));

    serviceClients.forEach((serviceRow) => {
      const service = serviceTotals.find(
        (s) => s.serviceId === serviceRow.serviceId
      );
      service.numClients = serviceRow.numClients;
    });

    serviceFollowUpClients.forEach((serviceRow) => {
      const service = followUpServicesTotal.find(
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

    programFollowUpClients.forEach((programRow) => {
      const program = followUpProgramTotals.find(
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

    serviceHoursByFollowUps.forEach((serviceHour) => {
      const service = followUpServicesTotal.find(
        (s) => s.serviceId === serviceHour.serviceId
      );

      service.totalFollowUpSeconds = serviceHour.totalFollowUpSeconds;
      service.totalDuration = toDuration(serviceHour.totalFollowUpSeconds);
      const program = followUpProgramTotals.find(
        (p) => p.programId === service.programId
      );

      program.totalFollowUpSeconds += serviceHour.totalFollowUpSeconds;
    });

    programTotals.forEach((program) => {
      program.totalDuration = toDuration(program.totalInteractionSeconds);
    });

    followUpProgramTotals.forEach((program) => {
      program.totalDuration = toDuration(program.totalFollowUpSeconds);
    });

    const grandTotal = {
      numInteractions: _.sum(programTotals.map((p) => p.numInteractions)),
      numFollowUps: allFollowUps[0].totalFollowUps,
      numClients: totalClients[0].numClients,
      totalInteractionSeconds: _.sum(
        programTotals.map((p) => p.totalInteractionSeconds)
      ),
      allFollowUpSeconds: allFollowUps[0].totalFollowUpSeconds,
      allFollowUpDuration: toDuration(allFollowUps[0].totalFollowUpSeconds),
    };
    grandTotal.totalDuration = toDuration(grandTotal.totalInteractionSeconds);

    res.send({
      grandTotal,
      programs: programTotals,
      followUpProgramTotals: followUpProgramTotals,
      unspecifiedFollowUpTotals: unspecifiedFollowUpTotals,
      services: serviceTotals,
      followUpServicesTotal: followUpServicesTotal,
      reportParameters: {
        start: req.query.start || null,
        end: req.query.end || null,
      },
    });
  });
});
