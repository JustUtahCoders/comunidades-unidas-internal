ALTER TABLE services MODIFY COLUMN serviceDesc VARCHAR(1028);

INSERT INTO services (
  serviceName,
  serviceDesc
) VALUES
("Citizenship", "Gain United States citizenship"),
("Family Petition", "Petition for certain family members to receive either a Green Card, a fiancé(e) visa or a K-3/K-4 visa"),
("Workers' Rights and Safety", "Know your rights in the workplace"),
("DACA", "Deferred Action for Childhood Arrivals allows individuals to defer action from deportation and become eligibile for a work permit"),
("Youth Groups", "Community events and groups for youth"),
("Leadership Classes", "Learn to become a leader within the community"),
("SNAP", "Supplemental Nutritional Assistance Program provides nutrition benefits to supplement the food budget of families"),
("Chronic Disease Testing", "Refer individuals to clinics where they can be tested for chronic diseases"),
("Nutrition", "A class that teaches nutrition"),
("Grocery Store Tour", "Walk through a grocery store as a group"),
("Cooking Classes", "Learn how to cook"),
("Community Engagement And Organizing", "Learn how to build and organize communities and events"),
("Financial Coach", "Use an assigned financial coach to help you budget"),
("Financial Education", "A class that teaches budgeting and financial options available to families");