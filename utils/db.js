const mysql = require('mysql2')
const { SQL_DB, SQL_HOST, SQL_USER, SQL_PASSWORD, SQL_PORT } = process.env

// Create a connection pool
const pool = mysql.createPool({
  host: SQL_HOST,
  user: SQL_USER,
  password: SQL_PASSWORD,
  database: SQL_DB,
  port: SQL_PORT,
})

module.exports = pool.promise()
