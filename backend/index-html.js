const { app } = require("./server");
const btoa = require("btoa");

// Any routes not handled will serve up the HTML file
app.use("*", (req, res) => {
  res.cookie(
    "user",
    btoa(
      JSON.stringify({
        fullName: req.session.passport.user.fullName,
        firstName: req.session.passport.user.firstName,
        lastName: req.session.passport.user.lastName,
        email: req.session.passport.user.email,
        accessLevel: req.session.passport.user.accessLevel,
        permissions: req.session.passport.user.permissions,
      })
    ),
    {
      secure: process.env.RUNNING_LOCALLY ? false : true,
    }
  );
  res.setHeader("cache-control", "no-store");
  res.render("index", {
    jsMainFile: process.env.RUNNING_LOCALLY
      ? "http://localhost:9018/comunidades-unidas-internal.js"
      : require("../static/manifest.json")["comunidades-unidas-internal.js"],
    navigatorCredentialsOptions: null,
  });
});
