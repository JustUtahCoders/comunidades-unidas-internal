const { app, invalidRequest, pool, databaseError } = require("../../server");
const {
  checkValid,
  nullableValidInteger
} = require("../utils/validation-utils");
const mysql = require("mysql");

// https://aspe.hhs.gov/prior-hhs-poverty-guidelines-and-federal-register-references
const povertyLines = {
  "2019": {
    firstPerson: 12490,
    additionalPerson: 4420
  },
  "2020": {
    firstPerson: 12760,
    additionalPerson: 4480
  }
};

app.get(`/api/reports/poverty-lines`, (req, res) => {
  const validationErrors = checkValid(req.query, nullableValidInteger("year"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const year = req.query.year || "2020";

  if (!povertyLines[year]) {
    return invalidRequest(
      res,
      `Poverty line for year ${year} is not yet implemented`
    );
  }

  const sql = mysql.format(
    `
      SELECT COUNT(*) numClients from clients WHERE isDeleted = false;

      ${povertyLineQuery(year)}

      -- bad data check
      SELECT COUNT(*) total
      FROM
        (
          SELECT MAX(dateAdded) latestDateAdded, clientId, householdIncome, householdSize FROM demographics GROUP BY clientId, householdIncome, householdSize
        ) latestDems
        JOIN
        clients
        ON latestDems.clientId = clients.id
      WHERE
        latestDems.householdIncome < 200
        AND
        clients.isDeleted = false;
      ;
    `,
    []
  );

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [resultTotal, resultsYear, badDataResults] = result;

    res.send({
      results: {
        totalClients: resultTotal[0].numClients,
        clientsBelowPovertyLine: resultsYear[0].belowPovertyLine,
        clientsBelow200DollarsAnnually: badDataResults[0].total
      },
      reportParameters: {
        povertyLineYear: year,
        povertyLineInfo:
          "https://aspe.hhs.gov/prior-hhs-poverty-guidelines-and-federal-register-references",
        costFirstPerson: povertyLines[year].firstPerson,
        costAdditionalPerson: povertyLines[year].additionalPerson
      }
    });
  });
});

function povertyLineQuery(year) {
  const { firstPerson, additionalPerson } = povertyLines[year];

  return `
    SELECT COUNT(*) belowPovertyLine
    FROM
      (
        SELECT MAX(dateAdded) latestDateAdded, clientId, householdIncome, householdSize FROM demographics GROUP BY clientId, householdIncome, householdSize
      ) latestDems
      JOIN
      clients
      ON latestDems.clientId = clients.id
    WHERE
      clients.isDeleted = false
      AND
      householdIncome <= (${firstPerson} + ${additionalPerson} * (houseHoldSize - 1))
    ;
  `;
}
