const { app, notFound } = require("../server");

app.use("/api/*", (req, res) => {
  notFound(res, `No such api`);
});
