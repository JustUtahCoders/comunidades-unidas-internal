// When app.js is present, elastic beanstalk will run this file instead of running yarn start.
// Since yarn start does local development things instead of prod things, we don't want
// elastic beanstalk to run it

require('./backend/server')