const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid } = require("../utils/validation-utils");
const mysql = require("mysql");
const _ = require("lodash");

app.get(`/api/reports/ages-and-genders`, (req, res) => {
  const validationErrors = checkValid(req.query);

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const sql = mysql.format(
    `
      SELECT COUNT(*) total, gender, CASE
        WHEN age between 0 and 17 then '0-17'
        WHEN age between 18 and 24 then '18-24'
        WHEN age between 25 and 34 then '25-34'
        WHEN age between 35 and 44 then '35-44'
        WHEN age between 45 and 54 then '45-54'
        WHEN age between 55 and 64 then '55-64'
        ELSE '65+'
        END AS ageRange
      FROM (
        SELECT TIMESTAMPDIFF(YEAR, birthday, CURDATE()) AS age, gender
        FROM clients
        WHERE clients.isDeleted = false
      ) ages
      GROUP BY ageRange, gender
      ORDER BY ageRange ASC
      ;

      SELECT COUNT(*) total, gender, CASE
        WHEN age between 0 and 17 then '0-17'
        WHEN age between 18 and 24 then '18-24'
        WHEN age between 25 and 34 then '25-34'
        WHEN age between 35 and 44 then '35-44'
        WHEN age between 45 and 54 then '45-54'
        WHEN age between 55 and 64 then '55-64'
        ELSE '65+'
        END AS ageRange
      FROM leads
      WHERE leads.isDeleted = false
      GROUP BY ageRange, gender
      ORDER BY ageRange ASC
      ;
    `,
    []
  );

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [clientRows, leadRows] = result;

    const totals = {
      ages: {
        "0-17": 0,
        "18-24": 0,
        "25-34": 0,
        "35-44": 0,
        "45-54": 0,
        "55-64": 0,
        "65+": 0,
      },
      genders: {},
      numClients: 0,
      numLeads: 0,
    };

    const clientResults = getEmptyResult();
    clientRows.forEach((row) => {
      clientResults[row.ageRange][row.gender] += row.total;
      clientResults.allAges[row.gender] += row.total;
      clientResults.allGenders[row.ageRange] += row.total;
      totals.ages[row.ageRange] += row.total;
      totals.genders[row.gender] = totals.genders[row.gender] || 0;
      totals.genders[row.gender] += row.total;
      totals.numClients += row.total;
    });

    const leadResults = getEmptyResult();
    leadRows.forEach((row) => {
      const gender = row.gender === null ? "unknown" : row.gender;
      leadResults[row.ageRange][gender] += row.total;
      leadResults.allAges[gender] += row.total;
      leadResults.allGenders[gender] += row.total;
      totals.ages[row.ageRange] += row.total;
      totals.genders[gender] = totals.genders[gender] || 0;
      totals.genders[gender] += row.total;
      totals.numLeads += row.total;
    });

    res.send({
      clients: clientResults,
      leads: leadResults,
      totals,
      reportParameters: {},
    });
  });
});

function getEmptyResult() {
  return {
    "0-17": {
      male: 0,
      female: 0,
      transgender: 0,
      nonbinary: 0,
      other: 0,
      unknown: 0,
    },
    "18-24": {
      male: 0,
      female: 0,
      transgender: 0,
      nonbinary: 0,
      other: 0,
      unknown: 0,
    },
    "25-34": {
      male: 0,
      female: 0,
      transgender: 0,
      nonbinary: 0,
      other: 0,
      unknown: 0,
    },
    "35-44": {
      male: 0,
      female: 0,
      transgender: 0,
      nonbinary: 0,
      other: 0,
      unknown: 0,
    },
    "45-54": {
      male: 0,
      female: 0,
      transgender: 0,
      nonbinary: 0,
      other: 0,
      unknown: 0,
    },
    "55-64": {
      male: 0,
      female: 0,
      transgender: 0,
      nonbinary: 0,
      other: 0,
      unknown: 0,
    },
    "65+": {
      male: 0,
      female: 0,
      transgender: 0,
      nonbinary: 0,
      other: 0,
      unknown: 0,
    },
    allAges: {
      male: 0,
      female: 0,
      transgender: 0,
      nonbinary: 0,
      other: 0,
      unknown: 0,
    },
    allGenders: {
      "0-17": 0,
      "18-24": 0,
      "25-34": 0,
      "35-44": 0,
      "45-54": 0,
      "55-64": 0,
      "65+": 0,
    },
  };
}
