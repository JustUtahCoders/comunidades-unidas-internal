const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");
const {
  checkValid,
  validId,
  nullableNonEmptyString,
  nullableValidDate
} = require("../utils/validation-utils");
const { atLeastOne } = require("../utils/patch-utils");
const { getClientById } = require("./get-client.api");
const { insertContactInformationQuery } = require("./insert-client.utils");

app.patch("/api/clients/:id", (req, res, next) => {
  const paramValidationErrors = checkValid(req.params, validId("id"));

  const bodyValidationErrors = checkValid(
    req.body,
    nullableNonEmptyString("firstName"),
    nullableNonEmptyString("lastName"),
    nullableValidDate("birthday"),
    nullableNonEmptyString("gender")
  );

  const validationErrors = [...paramValidationErrors, ...bodyValidationErrors];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const clientId = Number(req.params.id);

  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err, connection);
    }

    getClientById(connection, req.params.id, (selectErr, oldClient) => {
      if (selectErr) {
        return databaseError(req, res, err, connection);
      }

      const fullClient = Object.assign({}, oldClient, req.body);

      const queries = [];

      const clientChanged = atLeastOne(
        req.body,
        "firstName",
        "lastName",
        "birthday",
        "gender"
      );

      if (clientChanged) {
        queries.push(
          mysql.format(
            `
          UPDATE clients
          SET
            firstName = ?,
            lastName = ?,
            birthday = ?,
            gender = ?,
            modifiedBy = ?
          WHERE id = ?;
        `,
            [
              fullClient.firstName,
              fullClient.lastName,
              fullClient.birthday,
              fullClient.gender,
              req.session.passport.user.id,
              clientId
            ]
          )
        );
      }

      const contactInfoChanged = atLeastOne(
        req.body,
        "phone",
        "smsConsent",
        "email",
        "address.street",
        "address.city",
        "address.state",
        "address.zip",
        "housingStatus"
      );

      if (contactInfoChanged) {
        queries.push(
          insertContactInformationQuery(
            clientId,
            req.body,
            req.session.passport.user.id
          )
        );
      }

      if (queries.length === 0) {
        connection.release();

        res.send({
          client: oldClient
        });

        return;
      }

      connection.query(queries.join("\n"), (patchErr, result) => {
        if (patchErr) {
          return databaseError(req, res, err, connection);
        }

        getClientById(connection, req.params.id, (selectErr, client) => {
          if (selectErr) {
            return databaseError(req, res, err, connection);
          }

          connection.release();

          res.send({
            client
          });
        });
      });
    });
  });
});
