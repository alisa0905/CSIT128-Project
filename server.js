const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const myModule = require('./module');
const mySess = require('./session');

http.createServer(function (req, res) {
    const path = url.parse(req.url).pathname;

    if (path === '/loginPage') {
        if (req.method === 'POST') {
            let body = '';
        
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                body = querystring.parse(body);
                myModule.authenticateUser(res, body, mySess, myModule.postAuthentication);
            });
        } else {
            myModule.login(res); // Serve login page for GET requests
        }
    } else {
        // Serve login page for any other route
        myModule.login(res);
    }
}).listen(8080);

console.log("Server running at http://localhost:8080");
