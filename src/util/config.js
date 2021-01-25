const host = process.env.MYSQL_HOST || 'mysql';
const database = process.env.MYSQL_DATABASE || 'nodeapp';
const port = process.env.MYSQL_PORT || '3306';
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || 'password';
const connectionLimit = process.env.MYSQL_CONNECTION_LIMIT || 10;

module.exports = {
  host,
  database,
  port,
  user,
  password,
  connectionLimit,
};
