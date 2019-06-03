const { app, invalidRequest } = require("../server");
const { checkValid, nonEmptyString } = require("./utils/validation-utils");
const axios = require("axios");

app.post("/api/github-issues", (req, res, next) => {
  if (!process.env.GUEST_GITHUB_KEY) {
    res.status(500).send({
      error: "The server does not have a github key configured"
    });
    return;
  }

  const validationErrors = checkValid(
    req.body,
    nonEmptyString("name"),
    nonEmptyString("email"),
    nonEmptyString("title"),
    nonEmptyString("body")
  );

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  axios({
    method: "post",
    url:
      "https://api.github.com/repos/JustUtahCoders/comunidades-unidas-internal/issues",
    headers: {
      Authorization: `token ${process.env.GUEST_GITHUB_KEY}`
    },
    data: {
      title: req.body.title,
      body: `From: ${req.body.name}, ${req.body.email}\n\n${req.body.body}`
    }
  })
    .then(response => {
      res.status(200).send({
        issueNumber: response.data.number,
        issueUrl: `https://github.com/JustUtahCoders/comunidades-unidas-internal/issues/${
          response.data.number
        }`
      });
    })
    .catch(err => {
      res.status(err.response.status).send(err.response.data);
    });
});
