INSERT INTO services (serviceName, serviceDesc, programId) VALUES
  (
    "Youth Groups / Leadership Development",
    "Youth Groups / Leadership Development",
    (SELECT id from programs WHERE programName = "Preventive Health")
  );