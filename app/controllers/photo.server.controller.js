const Photo = require("../models/photo.server.model");
const fs = require("fs");
const lib = require("../lib/helper");
const User = require("../models/user.server.model");

// exports.getAllPhotosFromAuction = function(req, res) {
//     let auctionId = req.params.auctionId;
//     Photo.getAllPhotos(auctionId, function(result, error) {
//         if(error) {
//             res.statusMessage = "Not found";
//             res.status(404).send("Not found: Photos from Auction not found.")
//         } else {
//             res.statusMessage = "OK";
//             res.status(200).json(result);
//         }
//     });
// };

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
                            res.status(404).send(`Not found: Could not find photo in auction ${auction_id}`);
                        } else if (errorCode == 201) {
                            req.pipe(fs.createWriteStream(`./app/photos/${auction_id}.png`));
                            res.statusMessage = "OK";
                            res.status(201).send(`Successfully added photo to auction ${auction_id}`);
                        } else if (errorCode == 400) {
                            res.statusMessage = "Bad Request";
                            res.status(400).send(`Bad Request: A bad request was sent by the user (there may already be a photo for this auction)`);
                        } else if (errorCode == 500) {
                            res.statusMessage = "Internal server error.";
                            res.status(500).send(`Internal Server Error: A problem occurred getting information from the database.`);
                        } else if (errorCode == 401) {
                            res.statusMessage = "Unauthorized";
                            res.status(401).send("You are unauthorized to add a photo to this auction.")
                        } else if(errorCode == 402) {
                            res.statusMessage = "Bad Request";
                            res.status(402).send("You must create an auction first");
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
            res.status(404).send(`Not found: Could not get photo with id:${photo_id}`);
        } else if(errorCode == 400){
           res.statusMessage = "Bad request";
           res.status(200).send("Bad request: A bad request was sent from the user.");
        } else if(errorCode == 500) {
            res.statusMessage = "Internal Server Error.";
            res.status(500).send("Internal server error: A problem occurred at the server.");
        } else if(errorCode == 200) {
            res.statusMessage = "OK";
            res.status(200).end(result);
        }
    });
};

// exports.updatePhotoFromAuction = function(req, res) {
//     let auction_id = req.params.auctionId;
//     let photo_id = req.params.photoId;
//     let photo_data = {
//         photo_image_URI: req.body.photo_image_URI,
//         photo_displayorder: req.body.photo_displayorder
//     };
//
//     let photoImageURI = photo_data["photo_image_URI"].toString();
//     let photoDisplayOrder = photo_data["photo_displayorder"].toString();
//
//     let values = [
//         [photoImageURI],
//         [photoDisplayOrder],
//         [photo_id],
//         [auction_id]
//     ];
//
//     Photo.updatePhoto(values, function(result, error) {
//
//         //TODO Authorization
//         if(error) {
//             res.statusMessage = "Not found";
//             res.status(404).send(`Not found: Could not get photo with id:${photo_id} in auction id:${auction_id}`);
//         } else {
//             res.statusMessage = "OK";
//             res.status(201).send(`Photo (id: ${photo_id}) successfully updated from auction id: ${auction_id}`);
//         }
//     });
// };

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
                            res.status(404).send(`Not found: Could not find photo in auction ${auction_id}`);
                        } else if (errorCode == 201) {
                            res.statusMessage = "OK";
                            res.status(201).send(`Successfully removed photo from auction ${auction_id}`);
                        } else if (errorCode == 400) {
                            res.statusMessage = "Bad Request";
                            res.status(400).send(`Bad Request: A bad request was sent by the user (there may already be a photo for this auction)`);
                        } else if (errorCode == 500) {
                            res.statusMessage = "Internal server error.";
                            res.status(500).send(`Internal Server Error: A problem occurred getting information from the database.`);
                        } else if (errorCode == 401) {
                            res.statusMessage = "Unauthorized";
                            res.status(401).send("You are unauthorized to delete a photo to this auction.")
                        } else if(errorCode == 402) {
                            res.statusMessage = "Bad Request";
                            res.status(402).send("You must create an auction first");
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