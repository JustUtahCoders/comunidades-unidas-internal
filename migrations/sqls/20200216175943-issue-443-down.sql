DELETE FROM services WHERE serviceName = "Mammograms";
DELETE FROM services WHERE serviceName = "Sexual Education";
DELETE FROM services WHERE serviceName = "Family Planning";
DELETE FROM services WHERE serviceName = "Volunteers";

UPDATE services SET serviceName = "Youth Groups" WHERE serviceName = "Youth Groups - Monthly Meetings";
UPDATE services SET serviceName = "Promotora" WHERE serviceName = "Promotora - Monthly Meetings";