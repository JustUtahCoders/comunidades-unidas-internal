const mysql = require("mysql2");
const {
  app,
  pool,
  invalidRequest,
  databaseError,
  notFound,
} = require("../../../server");
const {
  checkValid,
  validId,
  validInteger,
  validDateTime,
} = require("../../utils/validation-utils");
const fs = require("fs");
const path = require("path");
const {
  getPartnerService,
} = require("../../partners/create-partner-service.api");
const { getPartner } = require("../../partners/create-partner.api");
const { getLeadById } = require("../get-lead.api");

const insertReferralSql = fs.readFileSync(
  path.resolve(__dirname, "./add-lead-referral.sql"),
  "utf-8"
);

app.post("/api/leads/:leadId/referrals", (req, res) => {
  const user = req.session.passport.user;
  const leadId = Number(req.params.leadId);

  const validationErrors = [
    ...checkValid(req.params, validId("leadId")),
    ...checkValid(
      req.body,
      validInteger("partnerServiceId"),
      validDateTime("referralDate")
    ),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const partnerServiceId = req.body.partnerServiceId;

  getLeadById(leadId, (err, lead) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (lead === null) {
      return notFound(`No lead exists with id ${leadId}`);
    }

    getPartnerService(
      { id: partnerServiceId, includeInactive: false },
      (err, partnerService) => {
        if (err) {
          return databaseError(req, res, err);
        }

        if (partnerService === 404) {
          return notFound(
            res,
            `No partner service found with id ${partnerServiceId}`
          );
        }

        getPartner(
          { id: partnerService.partnerId, includeInactive: false },
          (err, partner) => {
            if (err) {
              return databaseError(req, res, err);
            }

            if (partner === 404) {
              return notFound(
                res,
                `No active partner found for service ${partnerServiceId}`
              );
            }

            const query = mysql.format(insertReferralSql, [
              leadId,
              partnerServiceId,
              req.body.referralDate,
              user.id,
            ]);

            pool.query(query, (err, result) => {
              if (err) {
                return databaseError(req, res, err);
              }

              res.status(204).end();
            });
          }
        );
      }
    );
  });
});
