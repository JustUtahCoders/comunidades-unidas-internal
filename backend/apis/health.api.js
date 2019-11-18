const { app } = require("../server");

app.get("/api/health", (req, res) => {
  res.send("Everything is okay.");
});
