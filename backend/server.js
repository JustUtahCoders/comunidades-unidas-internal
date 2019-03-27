const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const mysql = require("mysql");
const bodyParser = require("body-parser");
require("./run-database-migrations");

const pool = mysql.createPool({
  connectionLimit: 20,
  host: process.env.RDS_HOSTNAME || "localhost",
  user: process.env.RDS_USERNAME || "root",
  password: process.env.RDS_PASSWORD || "password",
  database: process.env.RDS_DB_NAME || "local_db",
  port: process.env.RDS_PORT || "3306"
});

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "../static")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/api/duplicate-check/", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err);
    }
    let d = new Date(req.body.birthday);
    let year = d.getUTCFullYear();
    let month = d.getUTCMonth() + 1;
    let day = d.getUTCDate();
    let inserts = [
      "person",
      req.body.firstname,
      req.body.lastname,
      year,
      month,
      day
    ];
    let qryString =
      "SELECT personid,firstname,lastname,date_format(dob,'%m/%d/%Y')as birthDate,gender FROM ?? WHERE ";
    qryString +=
      "((firstname = ? OR lastname = ?) AND (year(dob) = ? OR month(dob) = ? OR day(dob) = ?))";
    let query = mysql.format(qryString, inserts);
    connection.query(query, function(err, rows, fields) {
      if (err) {
        return databaseError(req, res, err);
      }
      res.send(rows);
    });
  });
});
app.post("/api/users", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err);
    }

    connection.query(
      mysql.format(`SELECT * FROM Dummy WHERE name=?`, [req.body.name]),
      function(err, rows, fields) {
        connection.release();

        if (err) {
          return databaseError(req, res, err);
        }

        res.send(rows[0]);
      }
    );
  });
});

app.get("/api/github-key", (req, res, next) => {
  if (process.env.GUEST_GITHUB_KEY) {
    res.send({ "github-key": process.env.GUEST_GITHUB_KEY });
  } else {
    res.status(500).send({
      "github-key": "The server does not have a github key configured"
    });
  }
});

app.use("*", indexHtml);

function indexHtml(req, res, next) {
  res.render("index", {
    frontendBaseUrl: process.env.RUNNING_LOCALLY
      ? "http://localhost:9018"
      : "/static"
  });
  next();
}

function databaseError(req, res, err) {
  const msg = process.env.RUNNING_LOCALLY
    ? `Database Error for backend endpoint '${req.url}'. ${err}`
    : `Database error. Run 'eb logs' for more detail`;
  console.error(err);
  res.status(500).send({ error: msg });
}

app.listen(port, () => {
  console.log("Node Express server listening on port", port);
});
