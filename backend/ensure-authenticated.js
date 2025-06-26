const { app, insufficientPrivileges } = require("./server");
const passport = require("passport");

app.use("*", (req, res, next) => {
  if (req.session.passport && req.session.passport.user.id) {
    return next();
  } else if (
    (req.baseUrl === "/api/user-select" && req.method === "GET") ||
    (req.baseUrl === "/login" && req.method === "POST")
  ) {
    return next();
  } else if (req.baseUrl && req.baseUrl.includes("/api")) {
    const basicAuth = passport.authenticate("basic");
    basicAuth(req, res, (err) => {
      if (err) {
        insufficientPrivileges(
          res,
          typeof err === "string" ? err : "Unauthorized"
        );
      } else {
        next();
      }
    });
  } else if (req.baseUrl !== "/login") {
    return res.redirect("/login");
  }
});
