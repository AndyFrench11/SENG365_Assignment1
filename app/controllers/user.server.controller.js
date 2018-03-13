const User = require("../models/user.server.model");

exports.userById = function(req, res) {
    let userId = req.params.userId;
    User.getSingleUser(userId, function(result, error) {
        if(error){
            res.statusMessage = "Not found";
            res.status(404).send(`The user with id ${userId} cannot be found.`);
        } else {
            res.statusMessage = "OK";
            res.status(200).json(result);
        }

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

    User.insert(values, function(result, error) {
        if(error) {
            res.statusMessage = "Malformed Request";
            res.status(400).send("Malformed Request: Could not create user");
        } else {
            res.statusMessage = "OK";
            res.status(201).json({
                "id": result["insertId"]
            });
        }
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
