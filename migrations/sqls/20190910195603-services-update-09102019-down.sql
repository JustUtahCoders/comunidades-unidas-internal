UPDATE services
SET serviceName = "Workers' Rights and Safety"
WHERE serviceName = "Worker's Rights"
;

DELETE FROM services
WHERE serviceName = "Promotora"
	OR serviceName = "Free Consultation"
	OR serviceName = "Focus Groups"
	OR serviceName = "Worker's Safety"
;

INSERT INTO services (serviceName, serviceDesc, programId)
VALUES
	(
		"Youth Groups / Leadership Development",
		"Youth Groups / Leadership Development",
		(SELECT id FROM programs WHERE programName = "Preventive Health")
	)
;

DELETE FROM programs
WHERE programName = "Focus Groups"
;