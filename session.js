const session = require('express-session');
var mySession;

exports.setMySession = function (username) {
    session.userName = username;
    mySession = session;
    console.log("Session Created.");
};

exports.setUserIdSession = function (user_id) {
    session.user_id = user_id;
    mySession = session;
    console.log("User session Created.");
};

exports.getMySession = function(){
    return mySession;
};

exports.deleteSession = function () {
    mySession = "";
    console.log("Session Deleted.");
}