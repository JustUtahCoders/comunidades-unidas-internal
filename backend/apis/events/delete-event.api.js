const mysql = require("mysql");
const { app, databaseError, pool, invalidRequest } = require("../../server");
const { checkValid, validId } = require("../utils/validation-utils");

app.delete("/api/events/:eventId", (req, res) => {
  const validationErrors = checkValid(req.params, validId("eventId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const sql = mysql.format(
    `UPDATE events SET isDeleted = true WHERE id = ? AND isDeleted = false;`,
    [Number(req.params.eventId)]
  );

  pool.query(sql, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    } else if (result.affectedRows === 1) {
      res.status(204).end();
    } else {
      invalidRequest(res, `No such event with id ${req.params.eventId}`);
    }
  });
});
