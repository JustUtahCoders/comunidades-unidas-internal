/* Replace with your SQL commands */
CREATE TABLE programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  programName varchar(255),
  programDescription varchar(1028)
);

INSERT INTO programs (programName, programDescription) VALUES
  ("Preventive Health", "Preventive Health"),
  ("Nutrition / CRYS / SNAP", "Nutrition / CRYS / SNAP"),
  ("Immigration", "Immigration"),
  ("Financial Education / Coaching", "Financial Advising / Coaching"),
  ("Workers' Rights", "Workers' Rights"),
  ("Family Support", "Family Support Services"),
  ("Community Engagement and Organizing", "Community Engagement and Organizing")
;

ALTER TABLE services
  ADD COLUMN programId INT,
  ADD FOREIGN KEY programIdFk(programId) REFERENCES programs(id);

UPDATE services SET programId = (
  SELECT id from programs WHERE programName = "Immigration"
) WHERE serviceName = "Citizenship";

UPDATE services SET programId = (
  SELECT id from programs WHERE programName = "Immigration"
) WHERE serviceName = "Family Petition";

UPDATE services SET programId = (
  SELECT id from programs WHERE programName = "Workers' Rights"
) WHERE serviceName = "Workers' Rights and Safety";

UPDATE services SET programId = (
  SELECT id from programs WHERE programName = "Immigration"
) WHERE serviceName = "DACA";

UPDATE services SET programId = (
  SELECT id from programs WHERE programName = "Community Engagement and Organizing"
) WHERE serviceName = "Youth Groups";

UPDATE services SET programId = (
  SELECT id from programs WHERE programName = "Nutrition / CRYS / SNAP"
) WHERE serviceName = "SNAP";

UPDATE services SET programId = (
  SELECT id from programs WHERE programName = "Preventive Health"
), serviceName = "Chronic Disease Screenings"
WHERE serviceName = "Chronic Disease Testing";

UPDATE services SET programId = (
  SELECT id from programs WHERE programName = "Nutrition / CRYS / SNAP"
) WHERE serviceName = "Nutrition";

UPDATE services SET programId = (
  SELECT id from programs WHERE programName = "Nutrition / CRYS / SNAP"
) WHERE serviceName = "Grocery Store Tour";

UPDATE services SET programId = (
  SELECT id from programs WHERE programName = "Nutrition / CRYS / SNAP"
) WHERE serviceName = "Cooking Classes";

UPDATE services SET programId = (
  SELECT id from programs WHERE programName = "Financial Education / Coaching"
) WHERE serviceName = "Financial Coach";

UPDATE services SET programId = (
  SELECT id from programs WHERE programName = "Financial Education / Coaching"
) WHERE serviceName = "Financial Education";

UPDATE services SET programId = (
  SELECT id from programs WHERE programName = "Financial Education / Coaching"
) WHERE serviceName = "Leadership Classes";

UPDATE services
  SET serviceName = "Leadership Development - Monthly Meetings"
  WHERE serviceName = "Leadership Classes";

UPDATE intakeServices
  SET serviceId = (SELECT id FROM services WHERE serviceName = "Leadership Development - Monthly Meetings")
  WHERE serviceId = (SELECT id FROM services WHERE serviceName = "Community Engagement And Organizing");

DELETE FROM services WHERE serviceName = "Community Engagement And Organizing";

-- Insert new services
INSERT INTO services (serviceName, serviceDesc, programId) VALUES
  (
    "Chronic Care Guidance",
    "Chronic Care Guidance",
    (SELECT id from programs WHERE programName = "Preventive Health")
  );

INSERT INTO services (serviceName, serviceDesc, programId) VALUES
  (
    "Tobacco Prevention and Cessation",
    "Tobacco Prevention and Cessation",
    (SELECT id from programs WHERE programName = "Preventive Health")
  );

INSERT INTO services (serviceName, serviceDesc, programId) VALUES
  (
    "HIV / PrEP",
    "HIV / PrEP",
    (SELECT id from programs WHERE programName = "Preventive Health")
  );

INSERT INTO services (serviceName, serviceDesc, programId) VALUES
  (
    "Youth Groups / Leadership Development",
    "Youth Groups / Leadership Development",
    (SELECT id from programs WHERE programName = "Preventive Health")
  );

INSERT INTO services (serviceName, serviceDesc, programId) VALUES
  (
    "VDS Daily Attention",
    "VDS Daily Attention",
    (SELECT id from programs WHERE programName = "Preventive Health")
  );

INSERT INTO services (serviceName, serviceDesc, programId) VALUES
  (
    "VDS Mobile",
    "VDS Mobile",
    (SELECT id from programs WHERE programName = "Preventive Health")
  );

INSERT INTO services (serviceName, serviceDesc, programId) VALUES
  (
    "Saturday VDS",
    "Saturday VDS",
    (SELECT id from programs WHERE programName = "Preventive Health")
  );

INSERT INTO services (serviceName, serviceDesc, programId) VALUES
  (
    "Mobile Clinic",
    "Mobile Clinic",
    (SELECT id from programs WHERE programName = "Preventive Health")
  );

INSERT INTO services (serviceName, serviceDesc, programId) VALUES
  (
    "LDS Vouchers",
    "LDS Vouchers",
    (SELECT id from programs WHERE programName = "Family Support")
  );

INSERT INTO services (serviceName, serviceDesc, programId) VALUES
  (
    "Faxes",
    "Sending faxes for people",
    (SELECT id from programs WHERE programName = "Family Support")
  );

INSERT INTO services (serviceName, serviceDesc, programId) VALUES
  (
    "Voter Registration",
    "Voter Registration",
    (SELECT id from programs WHERE programName = "Community Engagement and Organizing")
  );