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
    "user_username VARCHAR(50)," +
    "user_fname VARCHAR(50)," +
    "user_lname VARCHAR(50)," +
    "user_email VARCHAR(50)," +
    "user_birthdate DATE," +
    "user_gender CHAR" +
    "user_password VARCHAR(50))";
    
    con.query(sql_table, function(err, result) {
        if (err) throw err;
        console.log("Table created!")
    });
});