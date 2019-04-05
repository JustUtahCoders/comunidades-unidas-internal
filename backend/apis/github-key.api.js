const {app} = require('../server')

app.get('/api/github-key', (req, res, next) => {
  if (process.env.GUEST_GITHUB_KEY) {
    res.send({'github-key': process.env.GUEST_GITHUB_KEY})
  } else {
    res.status(500).send({'github-key': "The server does not have a github key configured"})
  }
})