const GoogleStrategy = require("passport-google-oauth20").Strategy;
const CustomStrategy = require("passport-custom").Strategy;
const { app, pool, databaseError } = require("../server");
const passport = require("passport");
const cookieSession = require("cookie-session");
const mariadb = require("mariadb/callback.js");
const { responseFullName } = require("./utils/transform-utils");
const { BasicStrategy } = require("passport-http");
const bcrypt = require("bcrypt");

const useGoogleAuth = false;

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

if (useGoogleAuth) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      (token, refreshToken, profile, done) => {
        pool.query(
          mariadb.format(
            `
          INSERT IGNORE INTO users (googleId, firstName, lastName, email, accessLevel)
          VALUES(?, ?, ?, ?, ?)
        `,
            [
              profile.id,
              profile.name.givenName,
              profile.name.familyName,
              profile.emails[0].value,
              "Staff", // Start them off as staff, upgrade their access level later
            ]
          ),
          (err, result) => {
            if (err) {
              done(err);
            } else {
              const getUserQuery = mariadb.format(
                `
              SELECT * FROM users LEFT JOIN userPermissions ON users.id = userPermissions.userId WHERE users.googleId = ?;
            `,
                [profile.id]
              );

              pool.query(getUserQuery, (err, rows) => {
                if (err) {
                  done(err);
                } else {
                  const permissions = {
                    immigration: false,
                  };

                  rows.forEach((r) => {
                    if (r.permission) {
                      permissions[r.permission] = true;
                    }
                  });

                  done(null, {
                    id: rows[0].id,
                    googleProfile: profile,
                    fullName: responseFullName(
                      rows[0].firstName,
                      rows[0].lastName
                    ),
                    firstName: rows[0].firstName,
                    lastName: rows[0].lastName,
                    email: rows[0].email,
                    accessLevel: rows[0].accessLevel,
                    permissions,
                    token: token,
                  });
                }
              });
            }
          }
        );
      }
    )
  );
} else {
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
}

app.use(
  cookieSession({
    name: "session",
    keys: require("keygrip")([process.env.KEYGRIP_SECRET], "sha256"),
    maxAge: 144 * 60 * 60 * 1000, // 144 hours
    secure: process.env.RUNNING_LOCALLY ? false : true,
  })
);

app.use(passport.initialize());

app.get(
  "/login",
  useGoogleAuth
    ? passport.authenticate("google", {
        scope: ["profile", "email"],
        includeGrantedScopes: true,
        hd: "cuutah.org",
        successRedirect: "/",
      })
    : passport.authenticate("custom", {
        successRedirect: "/",
      })
);

app.get(
  "/login/select-account",
  useGoogleAuth
    ? passport.authenticate("google", {
        scope: ["profile", "email"],
        includeGrantedScopes: true,
        hd: "cuutah.org",
        prompt: "select_account",
      })
    : passport.authenticate("custom", {
        successRedirect: "/",
      })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    req.session.token = req.user.token;
    res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  req.session = null;
  res.cookie("user", "", { maxAge: 1 });
  res.redirect("/login/select-account");
});
