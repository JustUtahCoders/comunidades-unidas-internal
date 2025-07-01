const CustomStrategy = require("passport-custom").Strategy;
const {
  app,
  pool,
  databaseError,
  invalidRequest,
  notFound,
} = require("../server");
const passport = require("passport");
const cookieSession = require("cookie-session");
const mariadb = require("mariadb/callback.js");
const { responseFullName } = require("./utils/transform-utils");
const { BasicStrategy } = require("passport-http");
const bcrypt = require("bcrypt");
const { Fido2Lib } = require("fido2-lib");
const base64url = require("base64-arraybuffer");
const { checkUserRole } = require("./utils/auth-utils");
const {
  checkValid,
  validId,
  validString,
  nonEmptyString,
} = require("./utils/validation-utils.js");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new BasicStrategy((username, password, done) => {
    const getUser = mariadb.format(
      `SELECT users.id, users.firstName, users.lastName, users.email, users.accessLevel, userPermissions.permission, programmaticUsers.password FROM
        users JOIN programmaticUsers ON programmaticUsers.userId = users.id
        LEFT JOIN userPermissions ON users.id = userPermissions.userId
        WHERE programmaticUsers.username = ? AND programmaticUsers.expirationDate > NOW()
        ;`,
      [username]
    );

    pool.query(getUser, (err, rows) => {
      if (err) {
        return done(err);
      }

      if (!rows || rows.length === 0) {
        return done("Unauthorized");
      }

      const userRows = rows.filter((row) =>
        bcrypt.compareSync(password, row.password)
      );

      if (userRows.length === 0) {
        return done("Unauthorized");
      }

      const permissions = {
        immigration: false,
      };

      userRows.forEach((r) => {
        if (r.permission) {
          permissions[r.permission] = true;
        }
      });

      done(null, {
        id: userRows[0].id,
        googleProfile: null,
        fullName: responseFullName(userRows[0].firstName, userRows[0].lastName),
        firstName: userRows[0].firstName,
        lastName: userRows[0].lastName,
        email: userRows[0].email,
        accessLevel: userRows[0].accessLevel,
        permissions,
        token: null,
      });
    });
  })
);

if (process.env.NO_AUTH) {
  passport.use(
    new CustomStrategy((req, done) => {
      pool.query(
        `
      INSERT IGNORE INTO users
        (id, googleId, firstName, lastName, email, accessLevel)
      VALUES
        (1, 'fakegoogleid', 'Local', 'User', 'localuser@example.com', 'Administrator');
      
      INSERT IGNORE INTO userPermissions
        (userId, permission)
      VALUES
        (1, 'immigration');
      
      SELECT id, firstName, lastName, email, accessLevel FROM users WHERE id = 1;
    `,
        (err, results) => {
          if (err) {
            done(err);
          } else {
            const user = results[2][0];
            done(null, {
              id: user.id,
              googleProfile: null,
              fullName: responseFullName(user.firstName, user.lastName),
              firstName: user.firstName,
              lastName: user.lastName,
              accessLevel: user.accessLevel,
              permissions: {
                immigration: true,
              },
              email: user.email,
            });
          }
        }
      );
    })
  );
} else {
  passport.use(
    new CustomStrategy(async (req, done) => {
      const validationErrors = checkValid(
        req.body,
        validId("userId"),
        validString("challenge")
      );

      if (validationErrors.length > 0) {
        console.error(validationErrors);
        done(new Error(`Invalid request`));
        return;
      }

      pool.query(
        mariadb.format(
          `
      SELECT * FROM users
      WHERE id = ? AND isDeleted = false LIMIT 1;
    `,
          [req.body.userId]
        ),
        async (err, data) => {
          if (err) {
            console.error(err);
            done(new Error(`Error retrieving users`));
            return;
          }

          if (data.length === 0) {
            done(new Error(`No user found with id '${req.body.userId}'`));
            return;
          }

          const [user] = data;

          const attestationExpectations = {
            origin: process.env.SERVER_ORIGIN,
            challenge: base64url.decode(req.body.challenge),
            factor: "either",
            publicKey: user.email,
            prevCounter: Number(user.googleId),
            userHandle: base64url.encode(new TextEncoder().encode("123")),
          };
          const clientData = {
            ...req.body.credential,
            rawId: base64url.decode(req.body.credential.rawId),
            response: {
              clientDataJSON: base64url.decode(
                req.body.credential.response.clientDataJSON
              ),
              authenticatorData: base64url.decode(
                req.body.credential.response.authenticatorData
              ),
              signature: base64url.decode(
                req.body.credential.response.signature
              ),
              userHandle: base64url.decode(
                req.body.credential.response.userHandle
              ),
            },
          };

          try {
            await f2l.assertionResult(clientData, attestationExpectations);
            done(null, {
              id: user.id,
              googleProfile: null,
              fullName: responseFullName(user.firstName, user.lastName),
              firstName: user.firstName,
              lastName: user.lastName,
              accessLevel: user.accessLevel,
              permissions: {
                immigration: true,
              },
              email: user.email,
            });
            return;
          } catch (err) {
            console.error(err);
            done(new Error(`Failed to authenticate`));
          }
        }
      );
    })
  );
}

app.get(`/login`, async (req, res) => {
  const navigatorCredentialsOptions = await f2l.assertionOptions();
  navigatorCredentialsOptions.challenge = base64url.encode(
    navigatorCredentialsOptions.challenge
  );

  res.render("index", {
    jsMainFile: process.env.RUNNING_LOCALLY
      ? `${process.env.PUBLIC_PATH}comunidades-unidas-internal.js`
      : require("../../static/manifest.json")["comunidades-unidas-internal.js"],
    navigatorCredentialsOptions: JSON.stringify(navigatorCredentialsOptions),
  });
});

app.use(
  cookieSession({
    name: "session",
    keys: require("keygrip")([process.env.KEYGRIP_SECRET], "sha256"),
    maxAge: 144 * 60 * 60 * 1000, // 144 hours
    secure: process.env.RUNNING_LOCALLY ? false : true,
  })
);

app.use(passport.initialize());

app.post("/login", passport.authenticate("custom"), (req, res) => {
  res.status(204).end();
});

app.get("/logout", (req, res) => {
  req.logout();
  req.session = null;
  res.cookie("user", "", { maxAge: 1 });
  res.redirect("/login");
});

const f2l = new Fido2Lib({
  timeout: 42,
  rpId: "localhost",
  rpName: "Comunidades Unidas",
  challengeSize: 128,
  attestation: "direct",
  cryptoParams: [-7, -257],
  authenticatorAttachment: "cross-platform",
  authenticatorRequireResidentKey: true,
  authenticatorUserVerification: "required",
  authenticatorSelection: {
    residentKey: "required",
  },
});

let mostRecentAttestationChallenge;

app.get("/register-user", async (req, res) => {
  const authError = checkUserRole(req, "Administrator");

  if (authError) {
    return insufficientPrivileges(res, authError);
  }

  if (!req.query.name) {
    return invalidRequest(res, `name query param required`);
  }

  const attestationOptions = await f2l.attestationOptions();
  mostRecentAttestationChallenge = attestationOptions.challenge;
  attestationOptions.challenge = base64url.encode(attestationOptions.challenge);
  attestationOptions.user.id = base64url.encode(
    new TextEncoder().encode("123")
  );
  attestationOptions.user.displayName = req.query.name;
  attestationOptions.user.name = req.query.name;

  res.status(200).json(attestationOptions).end();
});

app.post("/register-user", async (req, res) => {
  const authError = checkUserRole(req, "Administrator");

  if (authError) {
    return insufficientPrivileges(res, authError);
  }

  const attestationExpectations = {
    origin: process.env.SERVER_ORIGIN,
    challenge: mostRecentAttestationChallenge,
    factor: "either",
  };

  const clientData = {
    ...req.body.credential,
    rawId: base64url.decode(req.body.credential.rawId),
  };

  let registrationResult;

  try {
    registrationResult = await f2l.attestationResult(
      clientData,
      attestationExpectations
    );
  } catch (err) {
    console.error(err);
    invalidRequest(res, `Error processing hardware security key registration`);
  }

  // Didn't migrate the database tables for easier transfer
  // email = publicKey from fido2
  // googleId = counter from fido2
  pool.query(
    mariadb.format(`
    INSERT INTO users (googleId, firstName, lastName, email, accessLevel)
    VALUES (?, ?, ?, ?, ?);
  `),
    [
      registrationResult.authnrData.get("counter"),
      req.body.firstName,
      req.body.lastName,
      registrationResult.authnrData.get("credentialPublicKeyPem"),
      "Staff",
    ],
    (err, data) => {
      if (err) {
        return databaseError(req, res, err);
      }

      res.status(204).end();
    }
  );
});

const userAttestations = {};

app.get(`/api/users/:userId/hardware-security-key-attestation`, (req, res) => {
  const authError = checkUserRole(req, "Administrator");

  if (authError) {
    return insufficientPrivileges(res, authError);
  }

  const validationErrors = checkValid(req.params, validId("userId"));
  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  pool.query(
    `SELECT id, firstName, lastName FROM users WHERE id = ? AND isDeleted = false`,
    [req.params.userId],
    async (err, data) => {
      if (err) {
        return databaseError(err);
      }

      if (!data || data.length === 0) {
        return notFound(res, `No such user with id '${req.params.userId}'`);
      }

      const [user] = data;

      const attestationOptions = await f2l.attestationOptions();
      userAttestations[req.params.userId] = attestationOptions.challenge;
      attestationOptions.challenge = base64url.encode(
        attestationOptions.challenge
      );
      attestationOptions.user.id = base64url.encode(
        new TextEncoder().encode(user.id)
      );
      const name = `${user.firstName} ${user.lastName}`;
      attestationOptions.user.displayName = name;
      attestationOptions.user.name = name;

      res.status(200).json(attestationOptions).end();
    }
  );
});

app.patch(`/api/users/:userId/hardware-security-key`, async (req, res) => {
  const authError = checkUserRole(req, "Administrator");

  if (authError) {
    return insufficientPrivileges(res, authError);
  }

  const validationErrors = [
    ...checkValid(req.params, validId("userId")),
    ...checkValid(
      req.body,
      nonEmptyString("credential.id"),
      nonEmptyString("credential.rawId"),
      nonEmptyString("credential.type"),
      nonEmptyString("credential.response.clientDataJSON"),
      nonEmptyString("credential.response.attestationObject")
    ),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const userId = Number(req.params.userId);
  const challenge = userAttestations[userId];

  if (!challenge) {
    return invalidRequest(
      res,
      `User has not requested a hardware security key attestation`
    );
  }

  const attestationExpectations = {
    origin: process.env.SERVER_ORIGIN,
    challenge,
    factor: "either",
  };

  const clientData = {
    ...req.body.credential,
    rawId: base64url.decode(req.body.credential.rawId),
  };

  let registrationResult;

  try {
    registrationResult = await f2l.attestationResult(
      clientData,
      attestationExpectations
    );
  } catch (err) {
    return invalidRequest(res, err);
  }

  pool.query(
    `UPDATE users SET googleId = ?, email = ? WHERE id = ?;`,
    [
      registrationResult.authnrData.get("counter"),
      registrationResult.authnrData.get("credentialPublicKeyPem"),
      userId,
    ],
    (err, data) => {
      if (err) {
        return databaseError(req, res, err);
      }

      res.status(204).end();
    }
  );
});

app.get("/api/user-select", (req, res) => {
  pool.query(
    mariadb.format(`
    SELECT id, firstName, lastName
    FROM users
    WHERE isDeleted = false
    ORDER BY id DESC
  `),
    (err, data) => {
      if (err) {
        return databaseError(req, res, err);
      }

      res.json({
        users: data,
      });
    }
  );
});

app.delete("/api/users/:userId", (req, res) => {
  const authError = checkUserRole(req, "Administrator");

  if (authError) {
    return insufficientPrivileges(res, authError);
  }

  pool.query(
    mariadb.format(
      `
      UPDATE users SET isDeleted = true WHERE Id = ?
  `,
      [req.params.userId]
    ),
    (err, data) => {
      if (err) {
        return databaseError(req, res, err);
      }

      res.status(204).end();
    }
  );
});
