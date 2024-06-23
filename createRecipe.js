var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",  
    database: "csit128_project",
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql_table = "CREATE TABLE recipes (recipe_id INT PRIMARY KEY," + 
    "recipe_name VARCHAR(50)," +
    "recipe_content VARCHAR(1000)," +
    "recipe_image VARCHAR(100)," +
    "recipe_tag1 VARCHAR(50)," +
    "recipe_tag2 VARCHAR(50)," +
    "recipe_user VARCHAR(50));" ;
    
    con.query(sql_table, function(err, result) {
        if (err) throw err;
        console.log("Table created!")
    });
});