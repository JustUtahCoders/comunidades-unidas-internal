const {app} = require('./server')
const btoa = require('btoa')

// Any routes not handled will serve up the HTML file
app.use('*', (req, res) => {
  if (req.session.token) {
    res.cookie('user', btoa(JSON.stringify({
      fullName: req.session.passport.user.profile.displayName,
      givenName: req.session.passport.user.profile.name.givenName,
      familyName: req.session.passport.user.profile.name.familyName,
      email: req.session.passport.user.profile.emails[0].value,
    })), {
      secure: process.env.RUNNING_LOCALLY ? false : true,
    })
    res.render('index', {
      frontendBaseUrl: process.env.RUNNING_LOCALLY ? 'http://localhost:9018' : '/static',
    })
  } else {
    res.redirect('/login')
  }
})