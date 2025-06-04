const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound,
} = require("../../../server");
const path = require("path");
const fs = require("fs");
const mariadb = require("mariadb");
const { checkValid, validId } = require("../../utils/validation-utils");
const getFollowUpSql = fs.readFileSync(
  path.resolve(__dirname, "./get-follow-up.sql"),
  "utf-8"
);
const { responseDateWithoutTime } = require("../../utils/transform-utils");

app.get("/api/clients/:clientId/follow-ups/:followUpId", (req, res) => {
  const validationErrors = [
    ...checkValid(req.params, validId("clientId"), validId("followUpId")),
  ];

  if (validationErrors.length) {
    return invalidRequest(res, validationErrors);
  }

  let { clientId, followUpId } = req.params;
  clientId = Number(clientId);
  followUpId = Number(followUpId);

  const query = mariadb.format(getFollowUpSql, [followUpId, followUpId]);
  pool.query(query, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const row = result[0];

    if (!row.id) {
      return notFound(res, `No follow up found with id ${followUpId}`);
    }

    if (row.clientId !== clientId) {
      return notFound(
        res,
        `Follow up with id ${followUpId} does not belong to client ${clientId}`
      );
    }

    res.send(formatFollowUpRow(row));
  });
});

function formatFollowUpRow(row) {
  return {
    id: row.id,
    serviceIds: JSON.parse(row.serviceIds).filter(Boolean),
    title: row.title,
    description: row.description,
    dateOfContact: responseDateWithoutTime(row.dateOfContact),
    duration: row.duration,
    appointmentDate: responseDateWithoutTime(row.appointmentDate),
    createdBy: JSON.parse(row.createdBy),
    lastUpdatedBy: JSON.parse(row.lastUpdatedBy),
  };
}

exports.formatFollowUpRow = formatFollowUpRow;
