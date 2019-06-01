const { app, databaseError, pool } = require("../../server");
const { responseFullName } = require("../utils/transform-utils");
const mysql = require("mysql");
const { checkValid, validId } = require("../utils/validation-utils");

app.get(`/api/clients/:id/audits`, (req, res) => {
  const validationErrors = checkValid(req.params, validId("id"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const clientId = Number(req.params.id);

  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err, connection);
    }

    const query = mysql.format(
      `
      # 1) last time core contact was updated
      SELECT clients.dateAdded, users.firstName, users.lastName, users.id
      FROM
        clients JOIN users ON clients.modifiedBy = users.id
      WHERE clients.id = ?;

      # 2) num contact information writes
      SELECT COUNT(*) FROM contactInformation WHERE clientId = ?;

      # 3) last time contact information was updated
      SELECT c.dateAdded, u.firstName, u.lastName, u.id
      FROM
        contactInformation c
        JOIN
        users u
        ON c.addedBy = u.id
      WHERE
        c.clientId = ?
      ORDER BY c.dateAdded DESC
      LIMIT 1;

      # 4) num demographics writes
      SELECT COUNT(*) FROM demographics WHERE clientId = ?;

      # 5) last time demographics updated
      SELECT d.dateAdded, u.firstName, u.lastName, u.id
      FROM
        demographics d
        JOIN
        users u
        ON d.addedBy = u.id
      WHERE
        d.clientId = ?
      ORDER BY d.dateAdded DESC
      LIMIT 1;

      # 6) num intakeData writes
      SELECT COUNT(*) FROM intakeData WHERE clientId = ?;

      # 7) last time intakeData was updated
      SELECT i.dateAdded, u.firstName, u.lastName, u.id
      FROM
        intakeData i
        JOIN
        users u
        ON i.addedBy = u.id
      WHERE
        i.clientId = ?
      ORDER BY i.dateAdded DESC
      LIMIT 1;
    `,
      [clientId, clientId, clientId, clientId, clientId, clientId, clientId]
    );

    connection.query(query, (err, result) => {
      if (err) {
        return databaseError(req, res, err, connection);
      }

      const [
        lastClient,
        numContactInfoWrites,
        lastContactInfo,
        numDemographicsWrites,
        lastDemographics,
        numIntakeDataWrites,
        lastIntakeData
      ] = result;

      connection.release();

      res.send({
        auditSummary: {
          client: {
            lastUpdate: {
              userId: lastClient[0].id,
              fullName: responseFullName(
                lastClient[0].firstName,
                lastClient[0].lastName
              ),
              firstName: lastClient[0].firstName,
              lastName: lastClient[0].lastName,
              timestamp: lastClient[0].dateAdded
            }
          },
          contactInformation: {
            numWrites: numContactInfoWrites[0]["COUNT(*)"],
            lastUpdate: {
              userId: lastContactInfo[0].id,
              fullName: responseFullName(
                lastContactInfo[0].firstName,
                lastContactInfo[0].lastName
              ),
              firstName: lastContactInfo[0].firstName,
              lastName: lastContactInfo[0].lastName,
              timestamp: lastContactInfo[0].dateAdded
            }
          },
          demographics: {
            numWrites: numDemographicsWrites[0]["COUNT(*)"],
            lastUpdate: {
              userId: lastDemographics[0].id,
              fullName: responseFullName(
                lastDemographics[0].firstName,
                lastDemographics[0].lastName
              ),
              firstName: lastDemographics[0].firstName,
              lastName: lastDemographics[0].lastName,
              timestamp: lastDemographics[0].dateAdded
            }
          },
          intakeData: {
            numWrites: numIntakeDataWrites[0]["COUNT(*)"],
            lastUpdate: {
              userId: lastIntakeData[0].id,
              fullName: responseFullName(
                lastIntakeData[0].firstName,
                lastIntakeData[0].lastName
              ),
              firstName: lastIntakeData[0].firstName,
              lastName: lastIntakeData[0].lastName,
              timestamp: lastIntakeData[0].dateAdded
            }
          }
        }
      });
    });
  });
});
