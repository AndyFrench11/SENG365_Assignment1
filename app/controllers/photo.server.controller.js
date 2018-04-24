const Photo = require("../models/photo.server.model");
const fs = require("fs");
const lib = require("../lib/helper");
const User = require("../models/user.server.model");

exports.addPhotoToAuction = function(req, res) {

    lib.checkAuthenticated(req, res, function(isAuthenticated) {
        if(isAuthenticated === true) {
            let auction_id = req.params.auctionId;
            let token = req.header("X-Authorization");
            User.getUserIdFromToken(token, function (user_id, errorCode) {
                if (errorCode == 500) {
                    res.statusMessage = "Internal server error.";
                    res.status(500).send(`Internal Server Error: A problem occurred getting information from the database.`);
                } else {
                        Photo.addPhoto(user_id, auction_id, function (result, errorCode) {
                            if (errorCode == 404) {
                                res.statusMessage = "Not found";
                                res.status(404).send(result);
                            } else if (errorCode == 201) {
                                try {
                                    //console.log("hello");
                                    req.pipe(fs.createWriteStream(`./app/photos/${auction_id}.png`));
                                    res.statusMessage = "OK";
                                    res.status(201).send(`Successfully added photo to auction ${auction_id}`);
                                } catch (err) {
                                    console.log(err);
                                    res.statusMessage = "Bad Request";
                                    res.status(400).send(`Bad Request: A bad request was sent by the user (the file may be too large or malformed)`);
                                }

                            } else if (errorCode == 400) {
                                res.statusMessage = "Bad Request";
                                res.status(400).send(`Bad Request: A bad request was sent by the user (there may already be a photo for this auction)`);
                            } else if (errorCode == 500) {
                                res.statusMessage = "Internal server error.";
                                res.status(500).send(`Internal Server Error: A problem occurred getting information from the database.`);
                            } else if (errorCode == 401) {
                                res.statusMessage = "Unauthorized";
                                res.status(401).send("You are unauthorized to add a photo to this auction.")
                            }


                        });

                    }
            });
        } else {
            res.statusMessage = "Unauthorized";
            res.status(401).send("You are unauthorized to access this data.")
        }



        });


};

exports.getSinglePhotoFromAuction = function(req, res) {
    let auction_id = req.params.auctionId;

    Photo.getSinglePhoto(auction_id, function(result, errorCode) {
        if(errorCode == 404) {
            res.statusMessage = "Not found";
            res.status(404).end(result);
        } else if(errorCode == 400){
           res.statusMessage = "Bad request";
           res.status(400).send("Bad request: A bad request was sent from the user.");
        } else if(errorCode == 500) {
            res.statusMessage = "Internal Server Error.";
            res.status(500).send("Internal server error: A problem occurred at the server.");
        } else if(errorCode == 200) {
            res.statusMessage = "OK";
            res.contentType('image/png');
            res.status(200).end(result);
        }
    });
};


exports.deleteAuctionPhoto = function(req, res) {
    lib.checkAuthenticated(req, res, function(isAuthenticated) {
        if(isAuthenticated === true) {
            let auction_id = req.params.auctionId;
            let token = req.header("X-Authorization");
            User.getUserIdFromToken(token, function (user_id, errorCode) {
                if (errorCode == 500) {
                    res.statusMessage = "Internal server error.";
                    res.status(500).send(`Internal Server Error: A problem occurred getting information from the database.`);
                } else {
                    Photo.deletePhoto(user_id, auction_id, function (result, errorCode) {
                        if (errorCode == 404) {
                            res.statusMessage = "Not found";
                            res.status(404).send(result);
                        } else if (errorCode == 201) {
                            res.statusMessage = "OK";
                            res.status(201).send(`Successfully removed photo from auction ${auction_id}`);
                        } else if (errorCode == 400) {
                            res.statusMessage = "Bad Request";
                            res.status(400).send(result);
                        } else if (errorCode == 500) {
                            res.statusMessage = "Internal server error.";
                            res.status(500).send(`Internal Server Error: A problem occurred getting information from the database.`);
                        } else if (errorCode == 401) {
                            res.statusMessage = "Unauthorized";
                            res.status(401).send("You are unauthorized to delete a photo to this auction.")
                        }

                    });

                }
            });
        } else {
            res.statusMessage = "Unauthorized";
            res.status(401).send("You are unauthorized to access this data.")
        }



    });
};