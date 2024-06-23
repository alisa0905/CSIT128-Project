const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const myModule = require('./module');
const mySess = require('./session');
const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "csit128_project"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL database!");
});

http.createServer(function (req, res) {
    const path = url.parse(req.url).pathname;

    if (path === '/loginPage') {
        if (req.method === 'POST') {
            let body = '';
        
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                const formData = querystring.parse(body);
                myModule.authenticateUser(res, formData, mySess, myModule.postAuthentication);
            });
        } else {
            myModule.login(res);
        }
    } else if (path === '/myRecipes.html') {
        fs.readFile("myRecipes.html", function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end("404 Not Found");
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            return res.end();
        });
    } else if (path === '/addRecipePage.html') {
        fs.readFile("addRecipePage.html", function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end("404 Not Found");
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            return res.end();
        });
    } else if (path === '/addRecipe' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const formData = querystring.parse(body);
            myModule.addRecipe(res, mySess, formData);
        });
    } else if (path.startsWith('/recipe') && req.method === 'GET') {
        const query = url.parse(req.url, true).query;
        const recipeId = query.id;

        if (recipeId) {
            myModule.getRecipeById(res, recipeId);
        } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Bad Request');
        }
    } else if (path === '/recipeList' && req.method === 'GET') {
        // Handle recipe search request
        const query = url.parse(req.url, true).query;
        const searchQuery = query.search;

        if (searchQuery) {
            // Perform MySQL query to fetch recipes based on searchQuery
            const sql = `SELECT * FROM recipes WHERE recipe_name LIKE '%${searchQuery}%'`;

            con.query(sql, (err, result) => {
                if (err) {
                    console.error(err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }
                // Render recipe list dynamically
                fs.readFile("recipeList.html", 'utf8', function (err, data) {
                    if (err) {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        return res.end("404 Not Found");
                    }
                    // Replace placeholder in HTML with dynamic content
                    const renderedData = data.replace('{{recipes}}', JSON.stringify(result));
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(renderedData);
                    res.end();
                });
            });
        } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Bad Request');
        }
    } else {
        myModule.login(res);
    }
}).listen(8080);

console.log("Server running at http://localhost:8080");
