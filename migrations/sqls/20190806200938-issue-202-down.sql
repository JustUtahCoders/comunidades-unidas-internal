/* Replace with your SQL commands */
UPDATE services
SET programId = (
  SELECT id FROM programs WHERE programName = "Financial Education / Coaching"
)
WHERE serviceName = "Leadership Development - Monthly Meetings";

DELETE FROM services
WHERE serviceName = "General Consultation"
OR serviceName = "Translation"
OR serviceName = "Green Card Renewal"
OR serviceName = "I-821 Temporary Protected Status (TPS)"
OR serviceName = "I-765 Application for Employment Authorization"
OR serviceName = "Freedom of Information Act (FOIA)"
OR serviceName = "Status Check"
OR serviceName = "I-94 Request"
OR serviceName = "Family Petition - Consular Processing";

UPDATE services
SET serviceName = "Family Petition"
WHERE serviceName = "Family Petition - Adjustment of Status";