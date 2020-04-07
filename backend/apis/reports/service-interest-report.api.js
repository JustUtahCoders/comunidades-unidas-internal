const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid } = require("../utils/validation-utils");
const mysql = require("mysql");
const _ = require("lodash");

app.get(`/api/reports/service-interests`, (req, res) => {
  const validationErrors = checkValid(req.query);

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const sql = mysql.format(
    `
      -- all services
      SELECT services.id serviceId, services.serviceName, programs.programName, services.programId FROM services JOIN programs ON programs.id = services.programId;

      -- all programs
      SELECT id programId, programName FROM programs;

      -- client interest in services
      SELECT programs.programName, services.serviceName, COUNT(*) clientsInterested, intakeServices.serviceId, services.id serviceId, programs.id programId
      FROM
        intakeServices
        JOIN (
          SELECT intakeData.id, intakeData.clientId
          FROM
          intakeData
          JOIN
          (
            SELECT MAX(dateAdded) latestDateAdded, clientId FROM intakeData GROUP BY clientId
          ) latestIntakeData
          ON intakeData.dateAdded = latestIntakeData.latestDateAdded AND latestIntakeData.clientId = intakeData.clientId
        ) latestIntakeIds
        ON intakeServices.intakeDataId = latestIntakeIds.id
        JOIN clients ON clients.id = latestIntakeIds.clientId
        JOIN services ON services.id = intakeServices.serviceId
        JOIN programs ON programs.id = services.programId
      WHERE
        clients.isDeleted = false
      GROUP BY intakeServices.serviceId
      ;

      -- client interest in programs
      SELECT COUNT(*) clientsInterested, programId, programName
      FROM (
        SELECT DISTINCT programs.id programId, clients.id clientId, programs.programName
        FROM
          intakeServices
          JOIN (
            SELECT intakeData.id, intakeData.clientId
            FROM
            intakeData
            JOIN
            (
              SELECT MAX(dateAdded) latestDateAdded, clientId FROM intakeData GROUP BY clientId
            ) latestIntakeData
            ON intakeData.dateAdded = latestIntakeData.latestDateAdded AND latestIntakeData.clientId = intakeData.clientId
          ) latestIntakeIds
          ON intakeServices.intakeDataId = latestIntakeIds.id
          JOIN clients ON clients.id = latestIntakeIds.clientId
          JOIN services ON services.id = intakeServices.serviceId
          JOIN programs ON programs.id = services.programId
        WHERE
          clients.isDeleted = false
      ) programInterests
      GROUP BY programId
      ;

      -- lead interest in services
      SELECT programs.id programId, services.id serviceId, COUNT(*) leadsInterested
      FROM
        leadServices
        JOIN leads ON leads.id = leadServices.leadId
        JOIN services ON services.id = leadServices.serviceId
        JOIN programs ON programs.id = services.programId
      WHERE
        leads.isDeleted = false
      GROUP BY serviceId
      ;

      -- lead interest in programs
      SELECT COUNT(*) leadsInterested, programId
      FROM (
        SELECT DISTINCT programs.id programId, leadServices.leadId
        FROM
          leadServices
          JOIN leads ON leads.id = leadServices.leadId
          JOIN services ON services.id = leadServices.serviceId
          JOIN programs ON programs.id = services.programId
        WHERE
          leads.isDeleted = false
      ) programInterests
      GROUP BY programId
      ;
    `,
    []
  );

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [
      services,
      programs,
      clientServiceInterests,
      clientProgramInterests,
      leadServiceInterests,
      leadProgramInterests,
    ] = result;

    const serviceTotals = services.map((s) => ({
      programName: s.programName,
      serviceName: s.serviceName,
      clientsInterested: 0,
      leadsInterested: 0,
      programId: s.programId,
      serviceId: s.serviceId,
    }));

    const programTotals = programs.map((p) => ({
      programName: p.programName,
      clientsInterested: 0,
      leadsInterested: 0,
      programId: p.programId,
    }));

    clientServiceInterests.forEach((clientInterest) => {
      const service = serviceTotals.find(
        (s) => s.serviceId === clientInterest.serviceId
      );
      service.clientsInterested = clientInterest.clientsInterested;
    });

    clientProgramInterests.forEach((clientInterest) => {
      const program = programTotals.find(
        (p) => p.programId === clientInterest.programId
      );
      program.clientsInterested = clientInterest.clientsInterested;
    });

    leadServiceInterests.forEach((leadInterest) => {
      const service = serviceTotals.find(
        (s) => s.serviceId === leadInterest.serviceId
      );
      service.leadsInterested = leadInterest.leadsInterested;
    });

    leadProgramInterests.forEach((leadInterest) => {
      const program = programTotals.find(
        (p) => p.programId === leadInterest.programId
      );
      program.leadsInterested = leadInterest.leadsInterested;
    });

    res.send({
      programs: programTotals,
      services: serviceTotals,
      reportParameters: {},
    });
  });
});
