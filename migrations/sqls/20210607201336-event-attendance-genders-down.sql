ALTER TABLE events
ADD COLUMN totalAttendance INT NOT NULL;

UPDATE events SET totalAttendance = attendanceMale + attendanceFemale + attendanceOther + attendanceUnknown;

ALTER TABLE events
DROP COLUMN attendanceUnknown,
DROP COLUMN attendanceOther,
DROP COLUMN attendanceMale,
DROP COLUMN attendanceFemale
;