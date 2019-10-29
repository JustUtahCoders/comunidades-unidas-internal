const mysql = require("mysql");
const { app, databaseError, pool, invalidRequest } = require("../../server");
const {
  checkValid,
  nonEmptyString,
  validDate,
  validBoolean,
  validInteger,
  validEnum,
  validArray
} = require("../utils/validation-utils");

app.post("/api/leads", (req, res, next) => {
  pool.getConnection((err, conntection) => {
    if (err) {
      return databaseError(req, res, err, connection);
    }

    const validityErrors = checkValid(
      req.body,
      validDate("dateOfSignUp"),
      nonEmptyString("firstName"),
      nonEmptyString("lastName"),
      nonEmptyString("phone"),
      validBoolean("smsConsent"),
      nonEmptyString("zip"),
      validInteger("age"),
      validEnum(
        "gender",
        "female",
        "male",
        "transgender",
        "non-binary",
        "other"
      ),
      validArray("leadServices", validInteger),
      validArray("eventSources", validInteger)
    );

    if (validityErrors.length > 0) {
      return invalidRequest(res, validityErrors, connection);
    }

    if (err) {
      return databaseError(req, res, err, connection);
    }

    const user = req.session.passort.user;

    connection.beginTransaction(err => {
      if (err) {
        return databaseError(req, res, err, connection);
      }

      const newLead = mysql.format(
        `
					INSERT INTO leads
						dateOfSignUp,
						firstName,
						lastName,
						age,
						zip,
						phone,
						smsConsent,
						gender,
						addedBy,
						modifiedBy
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
				`,
        [
          req.body.dateOfSignUp,
          req.body.firstName,
          req.body.lastName,
          req.body.age,
          req.body.zip,
          req.body.phone,
          req.body.smsConsent,
          req.body.gender,
          user.id,
          user.id
        ]
      );

      connection.query(newLead, (newLeadError, result, fields) => {
        if (newLeadErr) {
          connection.rollback();
          return databaseError(req, res, newLeadErr, connection);
        }

        const leadId = result.id;

        const newLeadServices = newLeadServicesQuery({});
      });
    });
  });
});
