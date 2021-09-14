SELECT
  COUNT(*) numEvents,
  (SUM(IFNULL(attendanceUnknown, 0)) + SUM(IFNULL(attendanceMale, 0)) + SUM(IFNULL(attendanceFemale, 0)) + SUM(IFNULL(attendanceOther, 0))) totalAttendance,
  SUM(IFNULL(eventMaterials.quantityDistributed, 0)) materialsDistributed
FROM
  events
  LEFT JOIN eventMaterials ON eventMaterials.eventId = events.id
WHERE
  eventDate BETWEEN ? AND ?
  AND eventName LIKE ?
  AND eventLocation LIKE ?
;