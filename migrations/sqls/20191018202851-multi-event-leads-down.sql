DROP TABLE IF EXISTS leadEvents;

ALTER TABLE leads ADD eventSource INT NOT NULL;

ALTER TABLE leads ADD CONSTRAINT leads_ibfk_1 FOREIGN KEY (eventSource)	REFERENCES events(id);
