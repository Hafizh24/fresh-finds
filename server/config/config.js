require('dotenv').config()

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    timezone: '+07:00'
  },
  test: {
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DATABASE,
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    dialect: 'mysql'
  },
  production: {
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DATABASE,
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    dialect: 'mysql',
    timezone: '+07:00'
  }
}
