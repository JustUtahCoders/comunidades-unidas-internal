const { app } = require("../server");
const { pool } = require('../server')

app.get("/api/health", (req, res) => {
  res.send("Everything is okay.");
});

app.get("/api/db-health", (req, res) => {
  pool.query("SELECT 1", (err, result) => {
    let dbConnectionSuccess
    if (err) {
      console.error(err)
      dbConnectionSuccess = false
    } else {
      dbConnectionSuccess = true
    }
    res.send({
      dbConnectionSuccess
    })
  })
})
