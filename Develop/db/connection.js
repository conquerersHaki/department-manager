const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Netrunner!',
    databse: 'company_db',
    port: '3001'
});

module.exports = db;