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

DELETE FROM programs
WHERE programName = "Focus Groups"
;