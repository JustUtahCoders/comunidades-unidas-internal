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

require("./run-database-migrations");

exports.app = app;
exports.pool = mysql.createPool({
  connectionLimit: 20,
  host: process.env.RDS_HOSTNAME || "localhost",
  user: process.env.RDS_USERNAME || "root",
  password: process.env.RDS_PASSWORD || "password",
  database: process.env.RDS_DB_NAME || "local_db",
  port: process.env.RDS_PORT || "3306"
});
exports.databaseError = function databaseError(req, res, err) {
  const msg = process.env.RUNNING_LOCALLY
    ? `Database Error for backend endpoint '${req.url}'. ${err}`
    : `Database error. Run 'eb logs' for more detail`;
  console.error(err);
  res.status(500).send({ error: msg });
};
exports.authenticatedEndpoint = function(req, res, next) {
  if (req.session.passport && req.session.passport.user.firstName) {
    return next();
  } else if (req.url.includes("/api")) {
    res.status(401).send({ error: "You must be logged in to call this API" });
  } else {
    return res.redirect("/login");
  }
};

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "../static")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use((err, req, res, next) => {
  console.error("ERROR: ", err);
});

require("./apis/login.api");
require("./apis/github-key.api");
require("./apis/add-client.api");
require("./apis/duplicate.api");
require("./index-html.js");

process.on("uncaughtException", function(err) {
  console.error("Backend error in node server code:");
  console.error(err);
});

app.listen(port, () => {
  console.log("Node Express server listening on port", port);
});
