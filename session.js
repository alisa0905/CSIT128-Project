let mySession = {};

exports.setMySession = function (username) {
    mySession.user_username = username;
};

exports.setUserIdSession = function (user_id) {
    mySession.user_id = user_id;
};

exports.getMySession = function () {
    return mySession;
};

exports.deleteSession = function () {
    mySession = {};
    console.log("Session Deleted.");
};