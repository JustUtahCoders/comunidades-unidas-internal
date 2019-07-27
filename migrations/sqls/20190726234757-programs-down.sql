/* Replace with your SQL commands */
ALTER TABLE services
  DROP FOREIGN KEY programIdFk,
  DROP COLUMN programId;

DROP TABLE programs;