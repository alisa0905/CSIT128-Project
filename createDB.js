var sql = require('mysql');

var con = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "password"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql_database = "CREATE DATABASE csit128_project";
    con.query(sql_database, function(err, result) {
        if (err) throw err;
        console.log("DB created!");
    });
});