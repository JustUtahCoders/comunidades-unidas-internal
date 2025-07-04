const { app, invalidRequest, pool, databaseError } = require("../../server");
const {
  checkValid,
  nullableValidInteger,
} = require("../utils/validation-utils");
const mariadb = require("mariadb/callback.js");

// https://aspe.hhs.gov/prior-hhs-poverty-guidelines-and-federal-register-references
const povertyLines = {
  2019: {
    firstPerson: 12490,
    additionalPerson: 4420,
  },
  2020: {
    firstPerson: 12760,
    additionalPerson: 4480,
  },
  2021: {
    firstPerson: 12880,
    additionalPerson: 4540,
  },
  2022: {
    firstPerson: 13590,
    additionalPerson: 4720,
  },
  2023: {
    firstPerson: 14580,
    additionalPerson: 5140,
  },
  2024: {
    firstPerson: 15060,
    additionalPerson: 5380,
  },
};

app.get(`/api/reports/poverty-lines`, (req, res) => {
  const validationErrors = checkValid(req.query, nullableValidInteger("year"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const year = req.query.year || "2024";

  if (!povertyLines[year]) {
    return invalidRequest(
      res,
      `Poverty line for year ${year} is not yet implemented`
    );
  }

  const { firstPerson, additionalPerson } = povertyLines[year];

  const sql = mariadb.format(
    `
      SELECT COUNT(*) numClients from clients WHERE isDeleted = false;

      SELECT COUNT(*) belowPovertyLine, contactInfo.zip
      FROM
        latestDemographics
        JOIN clients ON clients.id = latestDemographics.clientId
        JOIN latestContactInformation contactInfo ON contactInfo.clientId = clients.id
      WHERE
        clients.isDeleted = false
        AND
        latestDemographics.householdIncome <= (${firstPerson} + ${additionalPerson} * (houseHoldSize - 1))
      GROUP BY contactInfo.zip
      ;

      SELECT zip, COUNT(*) numClients
      FROM latestContactInformation contactInfo
      JOIN clients ON clients.id = contactInfo.clientId
      WHERE clients.isDeleted = false
      GROUP BY zip
      ;
    `,
    []
  );

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [resultTotal, resultsYear, zipResults] = result;

    const clientsBelowPovertyLine = {};
    resultsYear.forEach((yearResult) => {
      clientsBelowPovertyLine[yearResult.zip] = yearResult.belowPovertyLine;
    });

    const clientsByZip = {};
    zipResults.forEach((result) => {
      clientsByZip[result.zip] = result.numClients;
    });

    res.send({
      results: {
        totalClients: resultTotal[0].numClients,
        clientsBelowPovertyLine,
        clientsByZip,
      },
      reportParameters: {
        povertyLineYear: year,
        povertyLineInfo:
          "https://aspe.hhs.gov/prior-hhs-poverty-guidelines-and-federal-register-references",
        costFirstPerson: povertyLines[year].firstPerson,
        costAdditionalPerson: povertyLines[year].additionalPerson,
      },
    });
  });
});
