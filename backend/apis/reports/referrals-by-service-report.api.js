const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid, nullableValidDate } = require("../utils/validation-utils");
const mariadb = require("mariadb/callback.js");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const sql = fs.readFileSync(
  path.resolve(__dirname, "./referrals-by-service-report.sql"),
  "utf-8"
);

const defaultStart = "2000-01-01T0";
const defaultEnd = "3000-01-01T0";

app.get(`/api/reports/referrals-by-service`, (req, res) => {
  const validationErrors = checkValid(
    req.query,
    nullableValidDate("start"),
    nullableValidDate("end")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const startDate = req.query.start || defaultStart;
  const endDate = req.query.end || defaultEnd;

  const query = mariadb.format(sql, [startDate, endDate, startDate, endDate]);

  pool.query(query, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [clientCounts, leadCounts, partners] = result;

    const groupedRows = _.groupBy(partners, "partnerName");

    const results = [];

    for (let partnerName in groupedRows) {
      const firstRow = groupedRows[partnerName][0];

      const partner = {
        partnerId: firstRow.partnerId,
        partnerName: firstRow.partnerName,
        clientReferralCount: 0,
        leadReferralCount: 0,
        services: [],
      };

      for (let serviceRow of groupedRows[partnerName]) {
        const clientRow = clientCounts.find(
          (row) => row.partnerServiceId === serviceRow.partnerServiceId
        );
        const clientReferralCount = clientRow ? clientRow.referralCount : 0;

        const leadRow = leadCounts.find(
          (row) => row.partnerServiceId === serviceRow.partnerServiceId
        );
        const leadReferralCount = leadRow ? leadRow.referralCount : 0;

        const service = {
          partnerServiceId: serviceRow.partnerServiceId,
          partnerServiceName: serviceRow.partnerServiceName,
          clientReferralCount,
          leadReferralCount,
        };

        partner.clientReferralCount += clientReferralCount;
        partner.leadReferralCount += leadReferralCount;
        partner.services.push(service);
      }

      results.push(partner);
    }

    res.send({
      partners: results,
      reportParameters: {
        start: startDate === defaultStart ? null : startDate,
        end: endDate === defaultEnd ? null : endDate,
      },
    });
  });
});
