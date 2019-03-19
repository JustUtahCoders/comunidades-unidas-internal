// Database migrations are run through `.ebextensions` in elastic beanstalk.
// But locally we run them this way
if (process.env.RUNNING_LOCALLY) {
  const dbm = require('db-migrate').getInstance({
    env: 'dev',
  })

  const intervalId = setInterval(() => {
    dbm
    .up()
    .then(() => {
      clearInterval(intervalId)
      console.log('Finished running database migrations')
    })
    .catch(err => {
      console.log('waiting for database', err)
    })
  }, 4000)
}