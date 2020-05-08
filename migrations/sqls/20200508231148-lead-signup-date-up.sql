UPDATE
  leads
  LEFT JOIN leadEvents ON leads.id = leadEvents.leadId
  LEFT JOIN events ON leadEvents.eventId = events.id
SET
  leads.dateOfSignUp = events.eventDate
WHERE
  leads.dateOfSignUp = '2019-09-17';