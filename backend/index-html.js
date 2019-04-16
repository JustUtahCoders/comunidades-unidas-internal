const { app, authenticatedEndpoint } = require("./server");
const btoa = require("btoa");

// Any routes not handled will serve up the HTML file
app.use("*", authenticatedEndpoint, (req, res) => {
  res.cookie(
    "user",
    btoa(
      JSON.stringify({
        fullName: req.session.passport.user.fullName,
        firstName: req.session.passport.user.firstName,
        lastName: req.session.passport.user.lastName,
        email: req.session.passport.user.email
      })
    ),
    {
      secure: process.env.RUNNING_LOCALLY ? false : true
    }
  );
  res.render("index", {
    frontendBaseUrl: process.env.RUNNING_LOCALLY
      ? "http://localhost:9018"
      : "/static"
  });
});
