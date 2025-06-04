const { app, invalidRequest, pool, databaseError } = require("../../server");
const { checkValid, nullableValidDate } = require("../utils/validation-utils");
const mariadb = require("mariadb");
const _ = require("lodash");
const { toDuration } = require("./report-helpers");
const fs = require("fs");
const path = require("path");

const sql = fs.readFileSync(
  path.resolve(__dirname, "./revenue-by-service.sql"),
  "utf-8"
);
const defaultStart = "2000-01-01T0";
const defaultEnd = "3000-01-01T0";

app.get(`/api/reports/revenue-by-service`, (req, res) => {
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

  const query = mariadb.format(sql, [
    startDate,
    endDate,
    startDate,
    endDate,
    startDate,
    endDate,
    startDate,
    endDate,
  ]);

  pool.query(query, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [
      services,
      servicePayments,
      invoiceResult,
      allPaymentsResult,
      allDonationsResult,
    ] = result;

    const programTotals = {};
    const serviceTotals = {};

    services.forEach((service) => {
      serviceTotals[service.serviceId] = {
        serviceId: service.serviceId,
        programId: service.programId,
        serviceName: service.serviceName,
        totalPaid: 0,
      };

      programTotals[service.programId] = {
        programId: service.programId,
        programName: service.programName,
        totalPaid: 0,
      };
    });

    servicePayments.forEach((servicePayment) => {
      const lineItems = JSON.parse(servicePayment.lineItems);
      let paymentRemaining = servicePayment.amount;

      lineItems.forEach((li) => {
        if (li.serviceId) {
          const amount = li.quantity * li.rate;
          const serviceAmount = Math.floor(paymentRemaining, amount);
          paymentRemaining -= serviceAmount;
          const service = serviceTotals[li.serviceId];
          service.totalPaid += serviceAmount;
          programTotals[service.programId].totalPaid += serviceAmount;
        }
      });
    });

    res.send({
      serviceTotals: Object.values(serviceTotals),
      programTotals: Object.values(programTotals),
      invoiceTotals: {
        totalPaid: invoiceResult[0].invoiceTotal || 0,
      },
      allPaymentsTotals: {
        totalPaid: allPaymentsResult[0].allPaymentsTotal || 0,
      },
      donationTotals: {
        totalPaid: allDonationsResult[0].donationsTotal || 0,
      },
      reportParameters: {
        start: req.query.start || null,
        end: req.query.end || null,
      },
    });
  });
});
