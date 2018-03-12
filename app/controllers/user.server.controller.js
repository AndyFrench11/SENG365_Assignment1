const User = require("../models/user.server.model");

exports.userById = function(req, res) {
    let id = req.params.userId;
    User.getSingleUser(id, function(result) {
        res.json(result);
    });
};

exports.create = function(req, res) {
    let user_data = {
        "username": req.body.username,
        "givenName": req.body.givenName,
        "familyName": req.body.familyName,
        "email": req.body.email,
        "password": req.body.password
    };

    let username = user_data['username'].toString();
    let givenName = user_data['givenName'].toString();
    let familyName = user_data['familyName'].toString();
    let email = user_data['email'].toString();
    let password = user_data['password'].toString();

    let values = [
        [username],
        [givenName],
        [familyName],
        [email],
        [password]
    ];

    User.insert(values, function(result) {
        res.json(result);
        //res.writeHeader(200);
    });
};

exports.changeDetails = function(req,res) {
    let userId = req.params.userId;
    let values = {};

    if(req.body.username) {
        values["user_username"] = req.body.username;
    }

    if(req.body.givenName) {
        values["user_givenname"] = req.body.givenName;
    }

    if(req.body.familyName) {
        values["user_familyname"] = req.body.familyName;
    }

    if(req.body.email) {
        values["user_email"] = req.body.email;
    }

    if(req.body.password) {
        values["user_password"] = req.body.password;
    }


    User.update(userId, values, function(result) {
        res.json(result);
    })
};

exports.login = function(req, res) {
    //TODO Yet to be implemented
    User.sendLoginDetails()
};

exports.logout = function(req, res) {
    //TODO Yet to be implemented
    User.sendLogoutDetails();
};
