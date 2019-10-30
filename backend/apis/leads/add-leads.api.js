const mysql = require("mysql");
const { app, databaseError, pool, invalidRequest } = require("../../server");
const { checkValid } = require("../utils/validation-utils");

app.post("/api/leads", (req, res) => {
  const validityErrors = checkValid(req.body);
});
