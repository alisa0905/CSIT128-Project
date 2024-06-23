let mySession = {};

exports.setMySession = function (username) {
    mySession.userName = username;
    console.log("Session Created.");
};

exports.setUserIdSession = function (user_id) {
    mySession.user_id = user_id;
    console.log("User session Created.");
};

// Getter for session data
exports.getMySession = function () {
    return mySession;
};

// Function to delete session data
exports.deleteSession = function () {
    mySession = {}; // Clear all session data
    console.log("Session Deleted.");
};
