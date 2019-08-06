/* Replace with your SQL commands */

UPDATE services
SET programId = (
  SELECT id FROM programs WHERE programName = "Community Engagement and Organizing"
)
WHERE serviceName = "Leadership Development - Monthly Meetings";

INSERT INTO services (serviceName, serviceDesc, programId)
VALUES
  ("General Consultation", "General Consultation",
    (SELECT id FROM programs WHERE programName = "Immigration")
  ),
  ("Translation", "Translation", (
    SELECT id FROM programs WHERE programName = "Immigration"
  )),
  ("Green Card Renewal", "Green Card Renewal", (
    SELECT id FROM programs WHERE programName = "Immigration"
  )),
  ("I-821 Temporary Protected Status (TPS)", "I-821 Temporary Protected Status", (
    SELECT id FROM programs WHERE programName = "Immigration"
  )),
  ("I-765 Application for Employment Authorization", "I-765 Application for Employment Authorization", (
    SELECT id FROM programs WHERE programName = "Immigration"
  )),
  ("Freedom of Information Act (FOIA)", "Freedom of Information Act (FOIA)", (
    SELECT id FROM programs WHERE programName = "Immigration"
  )),
  ("Status Check", "Status Check", (
    SELECT id FROM programs WHERE programName = "Immigration"
  )),
  ("I-94 Request", "I-94 Request", (
    SELECT id FROM programs WHERE programName = "Immigration"
  )),
  ("Family Petition - Consular Processing", "Family Petition - Consular Processing", (
    SELECT id FROM programs WHERE programName = "Immigration"
  ));

UPDATE services
SET serviceName = "Family Petition - Adjustment of Status"
WHERE serviceName = "Family Petition";
