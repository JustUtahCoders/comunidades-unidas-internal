const { app } = require("./server");

app.use("*", (req, res, next) => {
  if (req.session.passport && req.session.passport.user.id) {
    return next();
  } else if (req.baseUrl && req.baseUrl.includes("/api")) {
    res.status(401).send({ error: "You must be logged in to call this API" });
  } else {
    return res.redirect("/login");
  }
});
