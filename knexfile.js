require('dotenv').config();
const { parseUri } = require('mysql-parse')


module.exports = {
  client: 'mysql',
  connection: parseUri(process.env.JAWSDB_URL)
}
