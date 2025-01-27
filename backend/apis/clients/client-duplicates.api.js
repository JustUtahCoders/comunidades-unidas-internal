const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql2");
const {
  checkValid,
  nonEmptyString,
  nullableValidDate,
  nullableNonEmptyString,
} = require("../utils/validation-utils");

app.get("/api/client-duplicates", (req, res, next) => {
  const validationErrors = checkValid(
    req.query,
    nonEmptyString("firstName"),
    nonEmptyString("lastName"),
    nullableValidDate("birthday")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  let values = [req.query.firstName, req.query.lastName];

  if (req.query.birthday) {
    const birthDate = new Date(req.query.birthday);
    const year = birthDate.getUTCFullYear();
    values.push(year - 10, year + 10);
  }

  values.push(req.query.firstName, req.query.lastName);

  const query = mysql.format(
    `
    SELECT id, firstName, lastName, date_format(birthday,'%Y/%m/%d') as birthday, gender
    FROM clients
    WHERE 
    isDeleted = false
    AND
    (firstName LIKE ? OR lastName LIKE ?)
    ${
      req.query.birthday
        ? `
        AND
        (YEAR(birthday) >= ? AND YEAR(birthday) <= ?)
      `
        : ``
    }
    ;

    SELECT id, firstName, lastName, gender, leadStatus
    FROM leads
    WHERE
      isDeleted = false
      AND (firstName LIKE ? OR lastName LIKE ?)
      AND leadStatus != 'convertedToClient'
    ;
  `,
    values
  );

  pool.query(query, function (err, result, fields) {
    if (err) {
      return databaseError(req, res, err);
    }
    const [clientRows, leadRows] = result;
    res.send({
      numDuplicates: clientRows.length,
      clientDuplicates: clientRows.map((row) => ({
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        birthday: row.birthday,
        gender: row.gender,
      })),
      possibleLeadSources: leadRows.map((row) => ({
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        leadStatus: row.leadStatus,
        gender: row.gender,
      })),
    });
  });
});
