var sql = require('mysql');

var con = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql_database = "CREATE DATABASE IF NOT EXISTS csit128_project";
    var user_table = "CREATE TABLE IF NOT EXISTS csit128_project.user (user_id INT PRIMARY KEY AUTO_INCREMENT, " + 
    "user_name VARCHAR(50), " +
    "user_email VARCHAR(50), " +
    "user_username VARCHAR(50), " +
    "user_password VARCHAR(50))";
    var recipe_table = "CREATE TABLE IF NOT EXISTS csit128_project.recipes (recipe_id INT PRIMARY KEY, " + 
    "recipe_name VARCHAR(50), " +
    "recipe_content VARCHAR(2000), " +
    "recipe_tag1 VARCHAR(50), " +
    "recipe_tag2 VARCHAR(50), " +
    "recipe_image LONGBLOB, " +
    "recipe_ingredients VARCHAR(100), " +
    "recipe_cookingtime INT, " +
    "recipe_servingsize INT, " +
    "recipe_user INT, " +
    "CONSTRAINT FOREIGN KEY (recipe_user) REFERENCES csit128_project.user(user_id) ON DELETE CASCADE ON UPDATE CASCADE)" ;
    const create_query = [sql_database, user_table, recipe_table];
    for (i = 0; i < 3; i++)
    {
        con.query(create_query[i], function(err) {
            if (err) throw err;
            console.log("Query executed!");
        });
    }
});