 const mysql = require('mysql2/promise');

const dbConnection = async() =>  await mysql.createConnection(process.env.DATABASE_URL);

module.exports = dbConnection;