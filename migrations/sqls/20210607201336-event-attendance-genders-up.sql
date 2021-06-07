ALTER TABLE events
ADD COLUMN attendanceMale INT DEFAULT 0,
ADD COLUMN attendanceFemale INT DEFAULT 0,
ADD COLUMN attendanceOther INT DEFAULT 0,
ADD COLUMN attendanceUnknown INT DEFAULT 0
;

UPDATE events SET attendanceUnknown = totalAttendance;

ALTER TABLE events
DROP COLUMN totalAttendance
;