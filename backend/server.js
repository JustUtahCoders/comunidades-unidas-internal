const path = require('path')
const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const mysql = require('mysql')
require('./run-database-migrations')

const pool = mysql.createPool({
  connectionLimit: 20,
  host     : process.env.RDS_HOSTNAME || 'localhost',
  user     : process.env.RDS_USERNAME || 'root',
  password : process.env.RDS_PASSWORD || 'password',
  database : process.env.RDS_DB_NAME || 'local_db',
  port     : process.env.RDS_PORT || '3306',
});

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs')
app.use('/static', express.static(path.join(__dirname, '../static')))

app.get('/api/users', (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err)
    }

    connection.query('SELECT COUNT(*) FROM Dummy', function (err, rows, fields) {
      connection.release()

      if (err) {
        return databaseError(req, res, err)
      }
    
      res.send('The solution is: ' + JSON.stringify(rows) + ' through Travis CI!')
      next()
    })
  })
})

app.get('/api/github-key', (req, res, next) => {
  if (process.env.GUEST_GITHUB_KEY) {
    res.send({'github-key': process.env.GUEST_GITHUB_KEY})
  } else {
    res.status(500).send({'github-key': "The server does not have a github key configured"})
  }
})

app.use(indexHtml)

function indexHtml(req, res, next) {
  res.render('index', {
    frontendBaseUrl: process.env.RUNNING_LOCALLY ? 'http://localhost:9018' : '/static',
  })
  next()
}

function databaseError(req, res, err) {
  const msg = process.env.RUNNING_LOCALLY ? `Database Error for backend endpoint '${req.url}'. ${err}` : `Database error. Run 'eb logs' for more detail`
  console.error(msg)
  res.status(500).send({error: msg})
}

app.listen(port, () => {
  console.log('Node Express server listening on port', port)
})