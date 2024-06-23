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
                console.log("Received chunk:", chunk.toString());
            });

            req.on('end', () => {
                const formData = querystring.parse(body);
                console.log("Parsed form data:", formData);
                myModule.authenticateUser(res, formData, mySess, myModule.postAuthentication);
            });
        } else {
            myModule.login(res); // Serve login page for GET requests
        }
    } else if (path === '/myRecipes.html') {
        // Serve myRecipes.html
        fs.readFile("myRecipes.html", function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end("404 Not Found");
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            return res.end();
        });
    } else {
        // Serve login page for any other route
        myModule.login(res);
    }
}).listen(8080);

console.log("Server running at http://localhost:8080");
