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
  host: process.env.RDS_HOSTNAME || "localhost",
  user: process.env.RDS_USERNAME || "root",
  password: process.env.RDS_PASSWORD || "password",
  database: process.env.RDS_DB_NAME || "local_db",
  port: process.env.RDS_PORT || "3306",
  multipleStatements: true
});

const getConnection = exports.pool.getConnection;

exports.pool.getConnection = function(errback) {
  const startTime = new Date().getTime();
  return getConnection.call(exports.pool, (err, connection) => {
    const endTime = new Date().getTime();
    console.log(
      `Getting a db connection took ${endTime -
        startTime} milliseconds. Connection info: ${
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
app.use(morgan("tiny"));

require("./apis/health.api");
require("./apis/login.api");
require("./apis/github-issues.api");
require("./apis/clients/add-client.api");
require("./apis/clients/client-duplicates.api");
require("./apis/clients/get-client.api");
require("./apis/clients/update-client.api");
require("./apis/clients/delete-client.api");
require("./apis/services/list-services.api");
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
require("./apis/events/list-events.api");
require("./apis/leads/get-lead.api");
require("./apis/events/get-event.api");
require("./apis/leads/list-leads.api");
require("./apis/leads/add-leads.api");
require("./apis/events/add-event.api");
require("./apis/leads/update-lead.api");
require("./apis/events/delete-event.api");

require("./apis/default-404.api.js");
require("./index-html.js");

process.on("uncaughtException", function(err) {
  console.error("Backend error in node server code:");
  console.error(err);
});

app.listen(port, () => {
  console.log("Node Express server listening on port", port);
});
