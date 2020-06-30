const { app } = require("./server");
const passport = require("passport");

app.use("*", (req, res, next) => {
  if (req.session.passport && req.session.passport.user.id) {
    return next();
  } else if (req.baseUrl && req.baseUrl.includes("/api")) {
    const basicAuth = passport.authenticate("basic");
    basicAuth(req, res, next);
  } else {
    return res.redirect("/login");
  }
});
