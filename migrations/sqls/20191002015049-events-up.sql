CREATE TABLE events (
	id INT AUTO_INCREMENT PRIMARY KEY,
	eventName VARCHAR(64) NOT NULL,
	eventLocation VARCHAR(64) NOT NULL,
	totalAttendence INT,
	isDeleted BOOLEAN DEFAULT false
);