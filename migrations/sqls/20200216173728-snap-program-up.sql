UPDATE programs SET programName = "Nutrition / CRYS", programDescription = "Nutrition / CRYS" WHERE programName = "Nutrition / CRYS / SNAP";
INSERT INTO programs (programName, programDescription) VALUES ("SNAP", "SNAP - food stamp registration");

SET @snapProgramId = LAST_INSERT_ID();

UPDATE services SET serviceName = "SNAP: New Application", programId = @snapProgramId WHERE serviceName = "SNAP";
INSERT INTO services (serviceName, serviceDesc, programId) VALUES ("SNAP: Recertification", "SNAP: Recertification", @snapProgramId);