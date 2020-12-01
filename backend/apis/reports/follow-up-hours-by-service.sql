-- holding this query for future purpose
-- num of clients per follow up
--  SELECT clientId, totalInteractions, services.id servicId, services.serviceName, programs.id programId, programs.programName FROM services LEFT OUTER JOIN (SELECT COUNT(*) totalInteractions, serviceId, followUpId FROM followUpServices GROUP BY serviceId) numInteractions ON services.id = numInteractions.serviceId JOIN programs ON programs.id = services.programId LEFT OUTER JOIN (SELECT id, clientId FROM followUps) f ON numInteractions.followUpId = f.id


-- num hours per service
-- SELECT clientHours.totalInteractionSeconds, services.id serviceId FROM services INNER JOIN (SELECT SUM(TIME_TO_SEC(duration)) totalInteractionSeconds, followUpServices.serviceId serviceId FROM followUps JOIN clients ON clients.id = followUps.clientId  JOIN followUpServices ON followUpServices.followUpId = followUps.id GROUP BY followUpServices.serviceId) clientHours ON services.id = clientHours.serviceId