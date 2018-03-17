const Auction = require("../models/auction.server.model");
const lib = require("../lib/helper");
const User = require("../models/user.server.model");

exports.getAllAuctions = function(req, res) {
    //TODO Yet to be implemented
    Auction.getAll();
};

exports.createAuction = function(req, res) {
    lib.checkAuthenticated(req, res, function(isAuthenticated) {
        if(isAuthenticated) {

            let token = req.header("X-Authorization");
            User.getUserIdFromToken(token, function (user_id, errorCode) {
                if (errorCode == 500) {
                    res.statusMessage = "Internal server error.";
                    res.status(500).send(`Internal Server Error: A problem occurred getting information from the database.`);
                } else {
                    let auction_data = {
                        "categoryId": req.body.categoryId,
                        "title": req.body.title,
                        "description": req.body.description,
                        "startDateTime": req.body.startDateTime,
                        "endDateTime": req.body.endDateTime,
                        "reservePrice": req.body.reservePrice,
                        "startingBid": req.body.startingBid
                    };

                    let categoryId = auction_data['categoryId'].toString();
                    let title = auction_data['title'].toString();
                    let description = auction_data['description'].toString();
                    let startDateTime = auction_data['startDateTime'].toString();
                    let endDateTime = auction_data['endDateTime'].toString();
                    let reservePrice = auction_data['reservePrice'].toString();
                    let startingBid = auction_data['startingBid'].toString();

                    let values = [
                        [categoryId],
                        [title],
                        [description],
                        [startDateTime],
                        [endDateTime],
                        [reservePrice],
                        [startingBid],
                        [user_id]
                    ];

                    Auction.create(values, function (result, errorCode) {
                        if (errorCode == 201) {
                            res.statusMessage = "OK";
                            res.status(201).send(result);
                        } else if (errorCode == 400) {
                            res.statusMessage = "Bad request.";
                            res.status(400).send("Bad request: This auction may already exist.");
                        } else if (errorCode == 500) {
                            res.statusMessage = "Internal Server Error";
                            res.status(500).send("Internal Server Error: There was a problem creating an auction on the server.");
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

exports.getSingleAuction = function(req, res) {
    let auctionId = req.params.auctionId;
    Auction.getSingleOne(auctionId, function(result) {
        res.json(result);
    });
};

exports.updateInformationOnAuction = function(req, res) {
    //TODO Yet to be implemented
    Auction.updateInformation();
};

exports.getBidsForSingleAuction = function(req, res) {
    //TODO Yet to be implemented
    Auction.getBids();
};

exports.makeBidForSingleAuction = function(req, res) {
    //TODO Yet to be implemented
    Auction.makeBid();
};
