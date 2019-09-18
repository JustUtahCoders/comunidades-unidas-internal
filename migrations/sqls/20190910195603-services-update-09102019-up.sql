INSERT INTO programs (programName, programDescription)
VALUES
	("Focus Groups", "Focus Groups")
;

INSERT INTO services (serviceName, serviceDesc, programId)
VALUES
	(
		"Promotora", 
		"Promoter of Comunidades Unidas",
		(SELECT id FROM programs WHERE programName = "Community Engagement and Organizing")
	),(
		"Free Consultation",
		"Free consultation for available immigration services",
		(SELECT id FROM programs WHERE programName = "Immigration")
	),(
		"Focus Groups",
		"Focus Groups",
		(SELECT id FROM programs WHERE programName = "Focus Groups")
	),(
		"Workers' Safety",
		"Know the safety protections you are entitled to at work",
		(SELECT id FROM programs WHERE programName = "Workers' Rights")
	)
;

UPDATE services
SET serviceName = "Workers' Rights"
WHERE serviceName = "Workers' Rights and Safety"
;
