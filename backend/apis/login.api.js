const GoogleStrategy = require("passport-google-oauth20").Strategy;
const {
  app,
  pool,
  databaseError,
  authenticatedEndpoint
} = require("../server");
const passport = require("passport");
const cookieSession = require("cookie-session");
const mysql = require("mysql");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    (token, refreshToken, profile, done) => {
      return done(null, {
        profile: profile,
        fullName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        token: token
      });
    }
  )
);

app.use(
  cookieSession({
    name: "session",
    keys: require("keygrip")([process.env.KEYGRIP_SECRET], "sha256"),
    maxAge: 144 * 60 * 60 * 1000, // 144 hours
    secure: process.env.RUNNING_LOCALLY ? false : true
  })
);

app.use(passport.initialize());

app.get(
  "/login",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    includeGrantedScopes: true,
    hd: "cuutah.org"
  })
);

app.get(
  "/login/select-account",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    includeGrantedScopes: true,
    hd: "cuutah.org",
    prompt: "select_account"
  })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/"
  }),
  (req, res) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return databaseError(req, res, err);
      }

      connection.query(
        mysql.format(
          `
          INSERT IGNORE INTO
          users (googleId, firstName, lastName, accessLevel)
          VALUES(?, ?, ?, ?)
        `,
          [
            req.user.profile.id,
            req.user.firstName,
            req.user.lastName,
            "Staff" // Start them off as staff, upgrade their access level later
          ]
        ),
        function(err, rows, fields) {
          connection.release();

          if (err) {
            console.error(err);
            return databaseError(req, res, err);
          }

          req.session.token = req.user.token;
          res.redirect("/");
        }
      );
    });
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  req.session = null;
  res.cookie("user", "", { maxAge: 1 });
  res.redirect("/login/select-account");
});
