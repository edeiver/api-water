const mysql = require('mysql')

const mysqlConenction = mysql.createConnection({
    host: "localhost",
    database: 'waterOS',
    user: "root",
    password: ""
})
mysqlConenction.connect((err) =>{
    if (err) throw err;
    console.log("Connected!");
  });

module.exports = mysqlConenction