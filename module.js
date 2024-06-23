var mysql = require('mysql');
var fs = require('fs');
var con;

// Create the connection once
con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "csit128_project"
});

con.connect(function(err) {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to database!");
});

exports.postAuthentication = function (res, mySess, user_id, body) {
    console.log("Post-authentication process started");
    if (user_id != -1 && user_id) {
        mySess.setMySession(body.username);
        mySess.setUserIdSession(user_id);
        s = mySess.getMySession();
        if (s.user_id) {
            console.log("Redirecting to myRecipes.html");
            res.writeHead(302, { 'Location': '/myRecipes.html' });
            return res.end();
        }
    } else {
        console.log("Authentication failed in post-authentication");
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
    console.log("Authenticating user:", body.username);
    const username = body.username;
    const password = body.password;

    const sql = "SELECT * FROM user WHERE user_username = ? AND user_password = ?";
    con.query(sql, [username, password], function (err, result) {
        if (err) {
            console.error("Database query error:", err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('Internal Server Error');
        }
        
        if (result.length > 0) {
            console.log("User authenticated successfully");
            callback(res, mySess, result[0].user_id, body);
        } else {
            console.log("Authentication failed");
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
