SET @preventiveHealthProgramId = (SELECT id FROM programs WHERE programName = "Preventive Health");
SET @communityEngagementProgramId = (SELECT id FROM programs WHERE programName = "Community Engagement And Organizing");

INSERT INTO services (serviceName, serviceDesc, programId) VALUES
  ("Mammograms", "Mammograms", @preventiveHealthProgramId),
  ("Sexual Education", "Sexual Education", @preventiveHealthProgramId),
  ("Family Planning", "Family Planning", @preventiveHealthProgramId),
  ("Volunteers", "Volunteers", @communityEngagementProgramId)
;

UPDATE services SET serviceName = "Youth Groups - Monthly Meetings" WHERE serviceName = "Youth Groups";
UPDATE services SET serviceName = "Promotora - Monthly Meetings" WHERE serviceName = "Promotora";
