if (process.env.RUNNING_LOCALLY) {
  require("dotenv").config();
}

const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

require("./run-database-migrations");

exports.app = app;
exports.pool = mysql.createPool({
  connectionLimit: 40,
  host: process.env.MYSQL_HOSTNAME || "localhost",
  user: process.env.MYSQL_USERNAME || "root",
  password: process.env.MYSQL_PASSWORD || "password",
  database: process.env.MYSQL_DB_NAME || "local_db",
  port: process.env.MYSQL_PORT || "3306",
  multipleStatements: true,
  timezone: "+00:00",
});

const getConnection = exports.pool.getConnection;

exports.pool.getConnection = function (errback) {
  const startTime = new Date().getTime();
  return getConnection.call(exports.pool, (err, connection) => {
    const endTime = new Date().getTime();
    console.log(
      `Getting a db connection took ${
        endTime - startTime
      } milliseconds. Connection info: ${
        exports.pool._freeConnections.length
      } ${exports.pool._allConnections.length} ${
        exports.pool._acquiringConnections.length
      }`
    );
    errback(err, connection);
  });
};

exports.invalidRequest = function invalidRequest(res, msg, connection) {
  if (connection) {
    connection.release();
  }
  console.log(msg);
  res.status(400).send({ error: msg });
};

exports.insufficientPrivileges = function insufficientPrivileges(res, msg) {
  console.log(msg);
  res.status(401).send({ error: msg });
};

exports.notFound = function notFound(res, msg) {
  res.status(404).send({ error: msg });
};

exports.databaseError = function databaseError(req, res, err, connection) {
  if (connection) {
    connection.release();
  }
  const msg = process.env.RUNNING_LOCALLY
    ? `Database Error for backend endpoint '${req.url}'. ${err}`
    : `Database error. Run 'eb logs' for more detail`;
  console.error(err);
  res.status(500).send({ error: msg });
};

exports.internalError = function internalError(req, res, err) {
  const msg = process.env.RUNNING_LOCALLY
    ? `Internal Server Error for backend endpoint '${req.url}'. ${err}`
    : `Internal Server Error. Run 'eb logs' for more detail`;
  console.error(err);
  res.status(500).send({ error: msg });
};

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "../static")));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use((err, req, res, next) => {
  console.error("ERROR: ", err);
});
app.use(
  process.env.RUNNING_LOCALLY
    ? morgan("dev")
    : morgan((tokens, req, res) =>
        [
          tokens.method(req, res),
          tokens.url(req, res),
          tokens.status(req, res),
          tokens.res(req, res, "content-length"),
          "-",
          tokens["response-time"](req, res),
          "ms",
          new Date(),
        ].join(" ")
      )
);

require("./apis/health.api");
require("./apis/login.api");
require("./ensure-authenticated.js");

require("./apis/github-issues.api");
require("./apis/clients/add-client.api");
require("./apis/clients/client-duplicates.api");
require("./apis/clients/get-client.api");
require("./apis/clients/get-clients-by-id.api");
require("./apis/clients/update-client.api");
require("./apis/clients/delete-client.api");
require("./apis/services/list-services.api");
require("./apis/services/patch-services.api");
require("./apis/services/create-service.api");
require("./apis/services/patch-programs.api");
require("./apis/services/create-program.api");
require("./apis/clients/list-clients.api");
require("./apis/clients/client-audit.api");
require("./apis/clients/client-logs/get-activity-logs.api");
require("./apis/clients/client-logs/delete-activity-logs.api");
require("./apis/clients/client-logs/create-activity-log.api");
require("./apis/clients/client-interactions/create-client-interaction.api");
require("./apis/clients/client-interactions/get-client-interaction.api");
require("./apis/clients/client-interactions/patch-client-interaction.api");
require("./apis/clients/client-interactions/delete-client-interaction.api");
require("./apis/clients/client-logs/patch-activity-log.api");
require("./apis/clients/integrations/get-integrations.api");
require("./apis/clients/integrations/patch-integration.api");
require("./apis/clients/follow-ups/create-follow-up.api");
require("./apis/clients/follow-ups/patch-follow-up.api");
require("./apis/clients/follow-ups/get-follow-up.api");
require("./apis/events/list-events.api");
require("./apis/leads/get-lead.api");
require("./apis/events/get-event.api");
require("./apis/leads/list-leads.api");
require("./apis/leads/add-leads.api");
require("./apis/events/add-event.api");
require("./apis/events/update-event.api");
require("./apis/leads/update-lead.api");
require("./apis/events/delete-event.api");
require("./apis/leads/delete-lead.api");
require("./apis/sms/send-bulk-sms.api");
require("./apis/sms/check-bulk-sms.api");
require("./apis/events/create-event-material.api");
require("./apis/events/get-event-material.api");
require("./apis/events/update-event-material.api");
require("./apis/events/delete-event-material.api");
require("./apis/events/get-all-event-materials.api");

require("./apis/reports/interaction-hours-by-client.api");
require("./apis/reports/interactions-by-service.api");
require("./apis/reports/poverty-line.api");
require("./apis/reports/english-level.api");
require("./apis/reports/country-of-origin-report.api");
require("./apis/reports/client-sources-report.api");
require("./apis/reports/ages-and-genders-report.api");
require("./apis/reports/zipcode-report.api");
require("./apis/reports/service-interest-report.api");
require("./apis/reports/outstanding-invoices.api");
require("./apis/reports/revenue-by-service.api");
require("./apis/reports/referrals-by-service-report.api");

require("./apis/clients/files/presigned-file-upload.api");
require("./apis/clients/files/add-client-files.api");
require("./apis/clients/files/get-client-files.api");
require("./apis/clients/files/get-client-file.api");
require("./apis/clients/files/delete-client-files.api");
require("./apis/clients/files/presigned-file-download.api");

require("./apis/invoices/create-invoice.api");
require("./apis/invoices/get-invoice.api");
require("./apis/invoices/patch-invoice.api");
require("./apis/invoices/get-client-invoices.api");
require("./apis/invoices/create-payment.api");
require("./apis/invoices/get-payment.api");
require("./apis/invoices/patch-payment.api");
require("./apis/invoices/delete-payment.api");
require("./apis/invoices/get-client-payments.api");
require("./apis/invoices/get-invoice-payments.api");
require("./apis/invoices/get-payment-receipt.api");
require("./apis/invoices/get-invoice-pdf.api");
require("./apis/invoices/get-detached-invoices.api");
require("./apis/invoices/get-detached-payments.api");

require("./apis/partners/create-partner.api");
require("./apis/partners/get-partner-list.api");
require("./apis/partners/update-partner.api");
require("./apis/partners/create-partner-service.api");
require("./apis/partners/update-partner-service.api");
require("./apis/clients/referrals/add-client-referral.api");
require("./apis/leads/referrals/get-lead-referrals.api");
require("./apis/leads/referrals/add-lead-referral.api");

require("./apis/users/list-users.api");
require("./apis/users/patch-user.api");

require("./apis/default-404.api.js");
require("./index-html.js");

process.on("uncaughtException", function (err) {
  console.error("Backend error in node server code:");
  console.error(err);
});

app.listen(port, () => {
  console.log("Node Express server listening on port", port);
});
