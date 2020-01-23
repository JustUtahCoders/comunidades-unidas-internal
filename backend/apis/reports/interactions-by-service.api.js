const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid, nullableValidDate } = require("../utils/validation-utils");
const mysql = require("mysql");
const _ = require("lodash");

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
          WHERE isDeleted = false AND dateOfInteraction >= ? AND dateOfInteraction <= ?
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
      SELECT clientHours.totalInteractionSeconds, SEC_TO_TIME(clientHours.totalInteractionSeconds) totalDuration, services.id serviceId
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
    `,
    [
      startDate,
      endDate,
      startDate,
      endDate,
      startDate,
      endDate,
      startDate,
      endDate
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
      serviceHours
    ] = result;

    const groupedServiceInteractions = _.groupBy(
      serviceInteractions,
      "programId"
    );
    const programTotals = Object.keys(groupedServiceInteractions).map(
      programId => {
        return {
          programId: Number(programId),
          programName: groupedServiceInteractions[programId][0].programName,
          numInteractions: _.sum(
            groupedServiceInteractions[programId].map(
              s => s.totalInteractions || 0
            )
          ),
          numClients: 0,
          totalInteractionSeconds: 0,
          totalDuration: "00:00:00"
        };
      }
    );

    const serviceTotals = serviceInteractions.map(service => ({
      serviceName: service.serviceName,
      programName: service.programName,
      numInteractions: service.totalInteractions || 0,
      numClients: 0,
      totalInteractionSeconds: 0,
      totalDuration: "00:00:00",
      serviceId: service.serviceId,
      programId: service.programId
    }));

    serviceClients.forEach(serviceRow => {
      const service = serviceTotals.find(
        s => s.serviceId === serviceRow.serviceId
      );
      service.numClients = serviceRow.numClients;
    });

    programClients.forEach(programRow => {
      const program = programTotals.find(
        p => p.programId === programRow.programId
      );
      program.numClients = programRow.numClients;
    });

    serviceHours.forEach(serviceHour => {
      const service = serviceTotals.find(
        s => s.serviceId === serviceHour.serviceId
      );
      service.totalInteractionSeconds = serviceHour.totalInteractionSeconds;
      service.totalDuration = serviceHour.totalDuration;

      const program = programTotals.find(
        p => p.programId === service.programId
      );
      program.totalInteractionSeconds += serviceHour.totalInteractionSeconds;
    });

    programTotals.forEach(program => {
      program.totalDuration = toDuration(program.totalInteractionSeconds);
    });

    const grandTotal = {
      numInteractions: _.sum(programTotals.map(p => p.numInteractions)),
      totalInteractionSeconds: _.sum(
        programTotals.map(p => p.totalInteractionSeconds)
      )
    };
    grandTotal.totalDuration = toDuration(grandTotal.totalInteractionSeconds);

    res.send({
      grandTotal,
      programs: programTotals,
      services: serviceTotals,
      reportParameters: {
        start: startDate,
        end: endDate
      }
    });
  });
});

function toDuration(allSecs) {
  const hrs = Math.floor(allSecs / (60 * 60));
  const mins = Math.floor((allSecs - hrs * 60 * 60) / 60);
  const secs = allSecs - hrs * 60 * 60 - mins * 60;

  return `${atLeastTwoDigits(hrs)}:${atLeastTwoDigits(mins)}:${atLeastTwoDigits(
    secs
  )}`;
}

function atLeastTwoDigits(num) {
  return num.toString().padStart(2, "0");
}
