var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",  
    database: "csit128_project"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql_table = "CREATE TABLE user (user_id INT PRIMARY KEY," + 
    "user_name VARCHAR(50)," +
    "user_email VARCHAR(50)," +
    "user_username VARCHAR(50)," +
    "user_password VARCHAR(50))";
    
    con.query(sql_table, function(err, result) {
        if (err) throw err;
        console.log("Table created!")
    });
});