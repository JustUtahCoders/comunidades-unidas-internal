SELECT
    id,
    CONCAT(firstName, ' ', lastName) fullName,
    gender,
    leadStatus
FROM leads
WHERE dateOfSignUp
    BETWEEN ? AND ?;
