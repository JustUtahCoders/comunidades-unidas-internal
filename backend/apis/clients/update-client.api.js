const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");
const {
  checkValid,
  validId,
  nonEmptyString,
  validDate
} = require("../utils/validation-utils");
const { getClientById } = require("./get-client.api");

app.patch("/api/clients/:id", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err, connection);
    }

    const paramValidationErrors = checkValid(req.params, validId("id"));

    const bodyValidationErrors = checkValid(
      req.body,
      nonEmptyString("firstName"),
      nonEmptyString("lastName"),
      validDate("birthday"),
      nonEmptyString("gender")
    );

    const validationErrors = [
      ...paramValidationErrors,
      ...bodyValidationErrors
    ];

    if (validationErrors.length > 0) {
      return invalidRequest(res, validationErrors);
    }

    const updateQueryValues = [
      req.body.firstName,
      req.body.lastName,
      req.body.birthday,
      req.body.gender,
      req.params.id
    ];

    const updateQuery = mysql.format(
      `
      UPDATE clients
      SET
        firstName = ?,
        lastName = ?,
        birthday = ?,
        gender = ?
      WHERE id = ?
    `,
      updateQueryValues
    );

    connection.query(updateQuery, (updateErr, result) => {
      if (updateErr) {
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
