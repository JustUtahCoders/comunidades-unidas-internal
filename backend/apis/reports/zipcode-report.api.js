const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid, nullableValidDate } = require("../utils/validation-utils");
const mysql = require("mysql");
const _ = require("lodash");
const ClientCapability = require("twilio/lib/jwt/ClientCapability");

app.get(`/api/reports/zipcode-report`, (req, res) => {
  const validationErrors = checkValid(
    req.query,
    nullableValidDate("start"),
    nullableValidDate("end")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const startDate = req.query.start || "2000-01-01T0";
  const endDate = req.query.end || "3000-01-01T0";

  const sql = mysql.format(
    `
        SELECT zip, city, COUNT(*) as clientCount
        FROM contactInformation GROUP BY zip ORDER BY clientCount DESC;
        `,
    [startDate, endDate, startDate, endDate]
  );

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [clientZipcode, clientCity, clientCount] = results;

    res.send({
      zipcode: clientZipcode,
      city: clientCity,
      clientCount: clientCount,
      reportParameters: {
        start: req.query.start || null,
        end: req.query.end || null,
      },
    });
  });
});
