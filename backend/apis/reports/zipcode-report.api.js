const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid, nullableValidDate } = require("../utils/validation-utils");
const mariadb = require("mariadb/callback.js");
const _ = require("lodash");

let zipToCounty = null;

app.get(`/api/reports/client-zipcodes`, (req, res) => {
  const validationErrors = checkValid(
    req.query,
    nullableValidDate("start"),
    nullableValidDate("end")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const startDate = (req.query.start || "2000-01-01") + "T00:00:00";
  const endDate = (req.query.end || "3000-01-01") + "T11:59:00";

  const sql = mariadb.format(
    `
      SELECT contactInformation.zip, COUNT(*) clientCount
      FROM
        latestContactInformation contactInformation
        JOIN clients ON clients.id = contactInformation.clientId
      WHERE clients.isDeleted = false AND clients.dateAdded BETWEEN ? AND ?
      GROUP BY zip
      ORDER BY clientCount DESC
      ;
        `,

    [startDate, endDate]
  );

  pool.query(sql, (err, results) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (!zipToCounty) {
      loadZipToCount();
    }

    const zipsByCounty = _.groupBy(results, (item) => {
      if (item.zip) {
        return zipToCounty[item.zip] || "(Unknown County)";
      } else {
        return "(Missing Zip)";
      }
    });

    res.send({
      zipsByCounty,
      totalClients: results.reduce((acc, item) => acc + item.clientCount, 0),
      totalZipCodes: results.length,
      reportParameters: {
        start: req.query.start || null,
        end: req.query.end || null,
      },
    });
  });
});

function loadZipToCount() {
  zipToCounty = {};
  const zipcodeCounties = require("./zipcode-counties.json");
  zipcodeCounties.forEach((item) => {
    zipToCounty[item.zip_code] = `${item.county} County, ${item.state}`;
  });
}
