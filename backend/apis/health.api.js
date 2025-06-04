const { app } = require("../server");
const { pool } = require("../server");

app.get("/api/health", (req, res) => {
  res.send("Everything is okay.");
});

app.get("/api/db-health", async (req, res) => {
  const connection = await pool.getConnection();
  let dbConnectionSuccess;
  try {
    const result = await connection.query("SELECT 1;");
  } catch (err) {
    console.error(err);
    dbConnectionSuccess = false;
  }

  res.send({
    dbConnectionSuccess,
  });
});
