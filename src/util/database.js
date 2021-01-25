require('dotenv').config();
// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: process.env.MYSQL_HOST || 'mysql',
//   database: process.env.MYSQL_DATABASE || 'nodeapp',
//   port: process.env.MYSQL_PORT || '3306',
//   user: process.env.MYSQL_USER || 'root',
//   password: process.env.MYSQL_PASSWORD || 'password',
//   connectionLimit: process.env.MYSQL_CONNECTION_LIMIT || 10,
// });

// module.exports = pool.promise();

const Sequelize = require('sequelize');
const { host, database, user, password, port } = require('../util/config');

const sequelize = new Sequelize(database, user, password, {
  dialect: 'mysql',
  host: host,
  port: port,
});

module.exports = sequelize;
