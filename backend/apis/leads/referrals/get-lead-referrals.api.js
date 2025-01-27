const mysql = require("mysql2");
const {
  app,
  pool,
  invalidRequest,
  databaseError,
  notFound,
} = require("../../../server");
const { checkValid, validId } = require("../../utils/validation-utils");
const fs = require("fs");
const path = require("path");
const { getLeadById } = require("../get-lead.api");

const getReferralsSql = fs.readFileSync(
  path.resolve(__dirname, "./get-lead-referrals.sql")
);

app.get("/api/leads/:leadId/referrals", (req, res) => {
  const user = req.session.passport.user;
  const leadId = Number(req.params.leadId);

  const validationErrors = checkValid(req.params, validId("leadId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  getLeadById(leadId, (err, lead) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (lead) {
      const query = mysql.format(getReferralsSql, [leadId]);
      pool.query(query, (err, result) => {
        if (err) {
          return databaseError(req, res, err);
        } else {
          res.send(
            result.map((row) => ({
              id: row.id,
              partnerServiceId: row.partnerServiceId,
              partnerServiceName: row.partnerServiceName,
              partnerPhone: row.partnerPhone,
              partnerName: row.partnerName,
              referralDate: row.referralDate,
              dateAdded: row.dateAdded,
              addedBy: row.addedBy,
            }))
          );
        }
      });
    } else {
      return notFound(res, `Could not find lead with id ${leadId}`);
    }
  });
});
