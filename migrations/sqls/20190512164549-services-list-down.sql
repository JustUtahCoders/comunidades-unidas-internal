ALTER TABLE services MODIFY COLUMN serviceDesc VARCHAR(128);

REMOVE FROM services
WHERE serviceName = "Citizenship",
serviceName = "Family Petition",
serviceName = "Workers' Rights and Safety",
serviceName = "DACA",
serviceName = "Youth Groups",
serviceName = "Leadership Classes",
serviceName = "SNAP",
serviceName = "Chronic Disease Testing",
serviceName = "Nutrition",
serviceName = "Grocery Store Tour",
serviceName = "Cooking Classes",
serviceName = "Community Engagement And Organizing",
serviceName = "Financial Coach",
serviceName = "Financial Education";
