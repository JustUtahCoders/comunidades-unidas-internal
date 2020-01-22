const { app, pool, invalidRequest, databaseError } = require("../../server");
const mysql = require("mysql");
const { checkValid, validId } = require("../utils/validation-utils");
const { getLeadById } = require("./get-lead.api");

app.delete("/api/leads/:leadId", (req, res) => {
  const validationErrors = checkValid(req.params, validId("leadId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const userId = req.session.passport.user.id;

  const leadId = Number(req.params.leadId);

  getLeadById(leadId, (err, data, fields) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (!data) {
      return invalidRequest(res, `Lead ${leadId} does not exist`);
    }

    const sql = mysql.format(
      `
        UPDATE leads
        SET isDeleted = true, modifiedBy = ?
        WHERE id = ?;
      `,
      [userId, leadId]
    );

    pool.query(sql, (err, result) => {
      if (err) {
        return databaseError(req, res, err);
      }

      res.status(204).end();
    });
  });
});
