const {
  app,
  databaseError,
  pool,
  invalidRequest,
  insufficientPrivileges,
} = require("../../server");
const mariadb = require("mariadb");
const {
  checkValid,
  validId,
  nullableNonEmptyString,
} = require("../utils/validation-utils");
const { checkUserRole } = require("../utils/auth-utils");
const { atLeastOne } = require("../utils/patch-utils");

app.patch("/api/programs/:programId", (req, res, next) => {
  const authError = checkUserRole(req, "Administrator");

  if (authError) {
    return insufficientPrivileges(res, authError);
  }

  const validationErrors = [
    ...checkValid(req.params, validId("programId")),
    ...checkValid(
      req.body,
      nullableNonEmptyString("programName"),
      nullableNonEmptyString("programDescription")
    ),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  if (!atLeastOne(req.body, "programName", "programDescription")) {
    return invalidRequest(
      res,
      `PATCH /api/programs/:programId must be called with a request body that has a programName and/or programDescription`
    );
  }

  const getProgram = mariadb.format(
    `
    SELECT * FROM programs WHERE id = ?;
    `,
    [req.params.programId]
  );

  pool.query(getProgram, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (result.length === 0) {
      return invalidRequest(
        res,
        `No such program with id ${req.params.programId}`
      );
    }

    const [originalProgram] = result;

    const finalProgram = {
      id: originalProgram.id,
      programName: req.body.programName || originalProgram.programName,
      programDescription:
        req.body.programDescription || originalProgram.programDescription,
    };

    const updateProgram = mariadb.format(
      `
      UPDATE programs SET programName = ?, programDescription = ? WHERE id = ?;
      `,
      [
        finalProgram.programName,
        finalProgram.programDescription,
        finalProgram.id,
      ]
    );

    pool.query(updateProgram, (err, result) => {
      if (err) {
        return databaseError(req, res, err);
      }

      res.send({
        program: finalProgram,
      });
    });
  });
});
