var http = require('http');
var url = require('url');
var fs = require('fs');
var myModule = require('./module')
var mySess = require('./session')
querystring = require('querystring');


http.createServer(function (req, res) {
    var body = '';
    var s;

    if (req.url == "/login") {

        // read chunks of POST data
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // when complete POST data is received
        req.on('end', () => {
            // use parse() method
            body = querystring.parse(body);

            // Authonticate user credentials.
        });

    } else if (req.url == "/myprofile") {
        s = mySess.getMySession();
        if (s !== undefined) {
            if (s.userName != "" && s.userName !== undefined) {
                myModule.getEmployee(res, s, myModule.navigateToUserProfile);                 
            }
        } else {
            // Redirect to the login page.
            myModule.login(res);
        }
    } else if (req.url == "/logout") {
        s = mySess.getMySession();
        if (s !== undefined) {
            if (s.userName != "" && s.userName !== undefined) {
                mySess.deleteSession();
            }
        } else {
            // Redirect to the login page.
            myModule.login(res);
        }
        myModule.logout(res);     
    } else if (req.url == "/home") { 
            
        s = mySess.getMySession();      
        if (s !== undefined) {
            if (s.userName != "" && s.userName !== undefined) {
                myModule.navigateToHome(res,s);
            }
        } else {
            // Redirect to the login page.
            myModule.login(res);
        }
    } else if (req.url == "/title" || req.url == "/title?" ) { 
        s = mySess.getMySession();
        if (s !== undefined) {
            if (s.userName != "" && s.userName !== undefined) {
                myModule.getTitles(res, s, myModule.navigateToTitle);
            }
        }
    } else if (req.url == "/add_title?") {  
        s = mySess.getMySession();
        if (s !== undefined) {
            if (s.userName != "" && s.userName !== undefined) {
                myModule.navigateToAddTitle(res, s);
            }
        }
    } else if (req.url.indexOf("/add_title_record") >= 0) {        
        s = mySess.getMySession();
        if (s !== undefined) {
            if (s.userName != "" && s.userName !== undefined) {
                var q = url.parse(req.url, true).query;
                myModule.addTitle(res, s, q.titleDesc, q.titleStartDate, myModule.navigateToAddTitle);
            }
        }
    } else {
        // Login page.
        myModule.login(res);
    }
}).listen(8080);