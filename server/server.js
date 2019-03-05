const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const mysql = require('mysql')

app.get('/', (req, res) => {
  const connection = mysql.createConnection({
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    database : process.env.RDS_DB_NAME,
    port     : process.env.RDS_PORT,
  });
  
  connection.connect()
  
  connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
    if (err) throw err
  
    res.end('The solution is: ', rows[0].solution)
  })
  
  connection.end()
})

app.listen(port, () => {
  console.log('Express server listening on port', port)
})