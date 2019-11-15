const { app } = require("../server");

app.get("/health", (req, res) => {
  res.send("Everything is okay.");
});
