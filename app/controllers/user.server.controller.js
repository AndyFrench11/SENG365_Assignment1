const User = require("../models/user.server.model");
const lib = require("../lib/helper");
const isJSON = require('is-valid-json');

exports.userById = function(req, res) {
    lib.checkAuthenticated(req, res, function(isAuthenticated) {
        if(isAuthenticated === true) {
            let userId = req.params.userId;
            lib.checkIsUser(userId, req, res, function(isUser) {
                User.getSingleUser(isUser, userId, function(result, error) {
                    if(error){
                        res.statusMessage = "Not found";
                        res.status(404).send(`The user with id ${userId} cannot be found.`);
                    } else {
                        res.statusMessage = "OK";
                        res.status(200).json(result);
                    }

                });

            });
        } else {
            res.statusMessage = "Unauthorized";
            res.status(401).send("You are unauthorized to access this data.")
        }
    });


};

exports.create = function(req, res) {
    try{
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

        User.insert(values, function(result, errorCode) {
            if(errorCode == 200) {

                res.statusMessage = "OK";
                res.status(201).send(result);
            } else if(errorCode == 400) {
                res.statusMessage = "Malformed Request";
                res.status(400).send("Malformed Request: Could not create user (user may already exist.)");


            } else if(errorCode == 500) {
                res.statusMessage = "Internal Server";
                res.status(500).send("Internal Server Error: There was a problem creating the user.")
            }
        });
    } catch(Error) {
        console.log("CHECK");
        res.statusMessage = "Malformed Request";
        res.status(400).send("Malformed Request: Could not create user (user may already exist.)");
    }

};

exports.changeDetails = function(req,res) {
        lib.checkAuthenticated(req,res, function(isAuthenticated) {
            if(isAuthenticated) {
                let userId = req.params.userId;
                lib.checkIsUser(userId, req, res, function(isUser)  {
                    if(isUser === true) {
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
                        console.log("YES");
                        User.update(userId, values, function(result, errorCode) {
                            if(errorCode == 200) {
                                res.statusMessage = "OK";
                                res.status(201).send(`Updated user with id: ${userId} successfully.`);
                            } else{
                                res.statusMessage = "Internal server error";
                                res.status(500).send("There was a server error updating the user.");
                            }
                        });


                    } else {
                        res.statusMessage = "Unauthorized";
                        res.status(401).send("You are unauthorized to access this data.")
                    }
                });

            } else {
                res.statusMessage = "Unauthorized";
                res.status(401).send("You are unauthorized to access this data.")
            }
            });


};

exports.login = function(req, res) {
    let isValidRequest = false;
    let values = {};
    if(req.query.username) {
        values["user_username"] = req.query.username;
    }
    if(req.query.email) {
        values["user_email"] = req.query.email;
    }
    if(req.query.password) {
        values["user_password"] = req.query.password;
    }
    if(((req.query.username) || (req.query.email)) && req.query.password) {
        isValidRequest = true;
    }
    if(isValidRequest) {
        User.sendLoginDetails(values, function (result, errorCode) {
            if (errorCode == 400) {
                res.statusMessage = "Invalid Request";
                res.status(400).send("Invalid username/email/password supplied");
            } else if (errorCode == 200) {
                res.statusMessage = "OK";
                res.status(200).send(result);
            } else if(errorCode == 500) {
                res.statusMessage = "Internal Server Error";
                res.status(500).send("Internal Server Error: There was a problem logging into the server.");
            }
        });
    } else {
        res.statusMessage = "Invalid Request";
        res.status(400).send("Invalid username/email/password supplied");
    }
};

exports.logout = function(req, res) {
    lib.checkAuthenticated(req, res, function(isAuthenticated) {
        if(isAuthenticated) {
            let token = req.header("X-Authorization");
            User.sendLogoutDetails(token, function(result, errorCode) {
                if(errorCode == 200) {
                    res.statusMessage = "OK";
                    res.status(200).send("Logged out successfully.");
                } else {
                    res.statusMessage = "Internal Server Error";
                    res.status(500).send("Internal Server Error: There was a problem logging out of the server.");
                }
            })
        } else {
            res.statusMessage = "Unauthorized";
            res.status(401).send("You are unauthorized to access this data.")
        }
    });

};
