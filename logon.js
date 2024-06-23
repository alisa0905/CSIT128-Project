var http = require('http');
var url = require('url');
var fs = require('fs');
var myModule = require('./module');
var mySess = require('./session')
querystring = require('querystring');


http.createServer(function (req, res) {
    var s;

    if (req.url == "/loginPage" && req.method == "POST") {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            body = querystring.parse(body);
            myModule.authenticateUser(res, body, mySess, myModule.postAuthentication);
        });
    

    }else if (req.url == "/myRecipes.html") {
            fs.readFile("myRecipes.html", function (err, data) {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    return res.end("404 Not Found");
                }
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                return res.end();
            });
        
    } else if (req.url == "/logout") {
        s = mySess.getMySession();
        if (s !== undefined) {
            if (s.user_username != "" && s.user_username !== undefined) {
                mySess.deleteSession();
            }
        } else {
            // Redirect to the login page.
            myModule.login(res);
        }
        myModule.logout(res);     
    } else if (req.url == "/homepage.html") { 
            
        s = mySess.getMySession();      
        if (s !== undefined) {
            if (s.user_username != "" && s.user_username !== undefined) {
                myModule.navigateToHome(res,s);
            }
        } else {
            // Redirect to the login page.
            myModule.login(res);
        }
    } else if (req.url == "/recipe" || req.url == "/recipe?" ) { 
        s = mySess.getMySession();
        if (s !== undefined) {
            if (s.user_username != "" && s.user_username !== undefined) {
                myModule.getTitles(res, s, myModule.navigateToTitle);
            }
        }
    } else if (req.url == "/addRecipePage?") {  
        s = mySess.getMySession();
        if (s !== undefined) {
            if (s.user_username != "" && s.user_username !== undefined) {
                myModule.navigateToAddTitle(res, s);
            }
        }
    } else if (req.url.indexOf("/addRecipe") >= 0) {        
        s = mySess.getMySession();
        if (s !== undefined) {
            if (s.user_username != "" && s.user_username !== undefined) {
                var q = url.parse(req.url, true).query;
                myModule.addTitle(res, s, q.titleDesc, q.titleStartDate, myModule.navigateToAddTitle);
            }
        }
    } else {
        // Login page.
        myModule.login(res);
    }
}).listen(6060);