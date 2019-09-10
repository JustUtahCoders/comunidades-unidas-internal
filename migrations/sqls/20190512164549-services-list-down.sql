/* Replace with your SQL commands */

ALTER TABLE services MODIFY COLUMN serviceDesc VARCAR(128);
	DROP COLUMN
		serviceName;