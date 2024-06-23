var mysql = require('mysql');
var fs = require('fs');
var con;

exports.connectToDB = function () {
    var con = mysql.createConnection({
        ost: "localhost",
        user: "root",
        password: "root",
        port: 3300,
        database: "csit128_example"
    });
    return con
};

exports.postAuthentication = function (res, mySess, user_id, body) {
    if (user_id != -1 && user_id != "" && user_id != undefined) {
        mySess.setMySession(body.username);
        mySess.setUserIdSession(user_id);
        s = mySess.getMySession();
        if (s.user_id != "" && s.user_id != undefined) {
            fs.readFile("homepage.html", function (err, data) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                return res.end();
            });
        }
    }
}

exports.login = function (res) {
    fs.readFile("loginpage.html", function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
};

exports.authenticateUser = function (res, body, mySess, myCallback) {
    var Username = body.username;
    var Password = body.password;
    // Connect to the database.
    con = this.connectToDB();
    con.connect(function (err) {
        if (err) throw err;
        // Get employee record.
        var sql = "SELECT * from employee WHERE emp_username = '" + Username + "' AND emp_password = '" + Password + "'";
        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result !== undefined && result.length > 0) {
                myCallback(res, mySess, result[0].emp_id, body);
            }
            else {
                // show error message on the login page.
                    var message = "<script>document.getElementById(\"demo_error_message\").innerHTML = \"You have entered an incorrect username or password!\";</script> ";
                    fs.readFile("login.html", function (err, data) {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.write(data);
                        return res.end(message);                       
                    });
            }      
     });
    });
};