var mysql = require('mysql');
var fs = require('fs');
var con;

exports.connectToDB = function () {
    con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "csit128_project"
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected to database!");
    });

    return con;
};

exports.postAuthentication = function (res, mySess, user_id, body) {
    if (user_id != -1 && user_id) {
        mySess.setMySession(body.username);
        mySess.setUserIdSession(user_id);
        s = mySess.getMySession();
        if (s.user_id) {
            res.writeHead(302, { 'Location': '/myRecipes.html' });
            return res.end();
        }
    } else {
        fs.readFile("loginPage.html", function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end("404 Not Found");
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data + "<script>document.getElementById('demo_error_message').innerHTML = 'You have entered an incorrect username or password!';</script>");
            return res.end();
        });
    }
};


exports.login = function (res) {
    fs.readFile("loginPage.html", function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
};

exports.authenticateUser = function (res, body, mySess, callback) {
    const username = body.username;
    const password = body.password;
    
    con = this.connectToDB();

    const sql = "SELECT * FROM user WHERE user_username = ? AND user_password = ?";
    con.query(sql, [username, password], function (err, result) {
        if (err) throw err;
        
        if (result.length > 0) {
            callback(res, mySess, result[0].user_id, body);
        } else {
            // Redirect to login page with error message
            res.writeHead(302, { 'Location': '/loginPage?error=1' });
            res.end();
        }
    });
};


const querystring = require('querystring');

exports.handleLogin = function (req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // Convert Buffer to string
    });
    req.on('end', () => {
        const formData = querystring.parse(body);
        authenticateUser(res, formData);
    });
};
