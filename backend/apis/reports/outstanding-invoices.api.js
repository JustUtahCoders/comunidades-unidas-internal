const { app, invalidRequest, pool, databaseError } = require("../../server");
const {
  checkValid,
  nullableValidTags,
  nullableValidDate,
} = require("../utils/validation-utils");
const mysql = require("mysql2");
const path = require("path");
const fs = require("fs");
const { responseFullName } = require("../utils/transform-utils");
const { sanitizeTags, validTagsList } = require("../tags/tag.utils");
const { intersection } = require("lodash");

const sql = fs.readFileSync(
  path.resolve(__dirname, "./outstanding-invoices.sql"),
  "utf-8"
);
const defaultStart = "1000-01-01";
const defaultEnd = "3000-01-01";

app.get(`/api/reports/outstanding-invoices`, (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(
      req.query,
      nullableValidTags("tags", user.permissions),
      nullableValidDate("start"),
      nullableValidDate("end")
    ),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const tags = sanitizeTags(req.query.tags);
  const redactedTags = validTagsList.filter((t) => !tags.includes(t));

  const start = req.query.start || defaultStart;
  const end = req.query.end || defaultEnd;
  const sqlQuery = mysql.format(sql, [start, end]);

  pool.query(sqlQuery, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    let outstandingSummary = {
        totalCharged: 0,
        totalPaid: 0,
      },
      completedSummary = {
        totalCharged: 0,
        totalPaid: 0,
      },
      outstandingInvoices = [],
      clientsWhoOwe = {};

    result.forEach((invoice) => {
      const redact =
        intersection(
          redactedTags,
          JSON.parse(invoice.tags)
            .map((t) => t.tag)
            .filter(Boolean)
        ).length > 0;
      const isCompleted = invoice.totalPaid >= invoice.totalCharged;

      if (!isCompleted) {
        const balance = invoice.totalCharged - invoice.totalPaid;

        const clients = JSON.parse(invoice.clientsWhoOwe);
        const totalPaid =
          typeof invoice.totalPaid === "number" ? invoice.totalPaid : 0;

        outstandingInvoices.push({
          ...invoice,
          balance,
          redacted: redact,
          totalPaid: redact ? null : totalPaid,
          clientsWhoOwe: clients.map((c) => ({
            ...c,
            fullName: responseFullName(c.firstName, c.lastName),
          })),
        });

        clients.forEach((client) => {
          if (!clientsWhoOwe[client.clientId]) {
            clientsWhoOwe[client.clientId] = {
              ...client,
              fullName: responseFullName(client.firstName, client.lastName),
              balance: 0,
            };
          }

          if (redact) {
            clientsWhoOwe[client.clientId].balance = null;
            clientsWhoOwe[client.clientId].redacted = true;
          }

          if (clientsWhoOwe[client.clientId].balance !== null) {
            clientsWhoOwe[client.clientId].balance += balance;
          }
        });
      }

      const summary = isCompleted ? completedSummary : outstandingSummary;
      summary.totalCharged += invoice.totalCharged;
      summary.totalPaid += invoice.totalPaid;
    });

    res.send({
      results: {
        outstandingSummary,
        completedSummary,
        clientsWhoOwe: Object.values(clientsWhoOwe).sort(
          (first, second) => second.balance - first.balance
        ),
        outstandingInvoices: outstandingInvoices.sort(
          (first, second) => second.balance - first.balance
        ),
      },
      reportParameters: {
        start: start === defaultStart ? null : start,
        end: end === defaultEnd ? null : end,
      },
    });
  });
});
