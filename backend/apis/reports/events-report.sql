SELECT
  COUNT(*) numEvents,
  (SUM(attendanceUnknown) + SUM(attendanceMale) + SUM(attendanceFemale) + SUM(attendanceOther)) totalAttendance,
  SUM(IFNULL(eventMaterials.quantityDistributed, 0)) materialsDistributed
FROM
  events
  LEFT JOIN eventMaterials ON eventMaterials.eventId = events.id
WHERE
  eventDate BETWEEN ? AND ?
  AND eventName LIKE ?
  AND eventLocation LIKE ?
;