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
      console.log('waiting for database')
    })
  }, 4000)
}