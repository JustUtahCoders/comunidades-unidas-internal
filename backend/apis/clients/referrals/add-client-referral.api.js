const mariadb = require("mariadb/callback.js");
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
const { getClientById } = require("../get-client.api");
const { insertActivityLogQuery } = require("../client-logs/activity-log.utils");
const { getPartner } = require("../../partners/create-partner.api");

const insertReferralSql = fs.readFileSync(
  path.resolve(__dirname, "./add-client-referral.sql"),
  "utf-8"
);

app.post("/api/clients/:clientId/referrals", (req, res) => {
  const user = req.session.passport.user;
  const clientId = Number(req.params.clientId);

  const validationErrors = [
    ...checkValid(req.params, validId("clientId")),
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

  getClientById(clientId, (err, client) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (client === null) {
      return notFound(`No client exists with id ${clientId}`);
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

            let query = mariadb.format(insertReferralSql, [
              clientId,
              partnerServiceId,
              req.body.referralDate,
              user.id,
            ]);
            query += insertActivityLogQuery({
              detailIdIsLastInsertId: true,
              clientId,
              title: `Client was referred to ${partner.name} for ${partnerService.name}`,
              description: null,
              logType: "referral",
              addedBy: user.id,
              dateAdded: req.body.referralDate,
            });

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
