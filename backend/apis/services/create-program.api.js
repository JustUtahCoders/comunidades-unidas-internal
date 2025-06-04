const {
  app,
  databaseError,
  pool,
  invalidRequest,
  insufficientPrivileges,
} = require("../../server");
const mariadb = require("mariadb/callback.js");
const { checkValid, nonEmptyString } = require("../utils/validation-utils");
const { checkUserRole } = require("../utils/auth-utils");

app.post("/api/programs", (req, res, next) => {
  const authError = checkUserRole(req, "Administrator");

  if (authError) {
    return insufficientPrivileges(res, authError);
  }

  const validationErrors = checkValid(
    req.body,
    nonEmptyString("programName"),
    nonEmptyString("programDescription")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const insertProgram = mariadb.format(
    `
    INSERT INTO programs (programName, programDescription)
    VALUES (?, ?);

    SELECT LAST_INSERT_ID() programId;
    `,
    [req.body.programName, req.body.programDescription]
  );

  pool.query(insertProgram, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const [programInsertResult, lastIdResult] = result;

    res.send({
      program: {
        id: lastIdResult[0].programId,
        programName: req.body.programName,
        programDescription: req.body.programDescription,
      },
    });
  });
});
