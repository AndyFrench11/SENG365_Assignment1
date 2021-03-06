const users = require("../models/user.server.model");
const isJSON = require('is-json');


exports.checkAuthenticated = function(req, res, done) {
    let token = req.header("X-Authorization");
    users.getUserToken(token, function(result, errorCode) {
        if(errorCode == 200){
            done(true);
        } else {
            done(false);
        }

    });

};

exports.checkIsUser = function(userId, req, res, done) {
    let token = req.header("X-Authorization");
    users.getUserIdCheck(token, userId, function(result, errorCode) {
        if(errorCode == 200) {
            done(true);
        } else {
            done(false);
        }
    });


};
