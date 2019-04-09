const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { app } = require("../server");
const passport = require("passport");
const cookieSession = require("cookie-session");

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
    req.session.token = req.user.token;
    console.log("session token", req.session.token, req.user);
    res.redirect("/");
    res.on("finish", () => {
      console.log("headers", res.getHeaders());
    });
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  req.session = null;
  res.cookie("user", "", { maxAge: 1 });
  res.redirect("/login/select-account");
});

app.use("/api/*", (req, res, next) => {
  if (req.session.token) {
    next();
  } else {
    res.status(401).send({
      error: "Please login to call this api"
    });
  }
});
