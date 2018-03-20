const Auction = require("../models/auction.server.model");
const lib = require("../lib/helper");
const User = require("../models/user.server.model");
const datetime = require('node-datetime');

exports.getAllAuctions = function(req, res) {

    Auction.getAll(req.query, function(result, errorCode) {
        if(errorCode == 200) {
            res.statusMessage = "OK";
            res.status(200).send(result);
        } else if(errorCode == 400) {
            res.statusMessage = "Bad request";
            res.status(400).send(result);
        } else if(errorCode == 500) {
            res.statusMessage = "Internal server error";
            res.status(500).send("Internal server error: An error took place retrieving information from the server.")
        }
    });
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

                    let currentDate = datetime.create().format("Y-m-d H:M:S");
                    console.log(currentDate);


                    let values = [
                        [categoryId],
                        [title],
                        [description],
                        [startDateTime],
                        [endDateTime],
                        [reservePrice],
                        [startingBid],
                        [user_id],
                        [currentDate]
                    ];

                    Auction.create(values, function (result, errorCode) {
                        if (errorCode == 201) {
                            res.statusMessage = "OK";
                            res.status(201).send(result);
                        } else if (errorCode == 400) {
                            res.statusMessage = "Bad request.";
                            res.status(400).send(result);
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

exports.getAuction = function(req, res) {
    let auctionId = req.params.auctionId;
    Auction.getSingleAuction(auctionId, function(result, errorCode) {
        if(errorCode == 200) {
            res.statusMessage = "OK";
            res.status(200).send(result);
        } else if(errorCode == 400) {
            res.statusMessage = "Bad request";
            res.status(400).send(result);
        } else if(errorCode == 404) {
            res.statusMessage = "Not found";
            res.status(404).send(`Not found: The auction with id ${auctionId} was not found.`);
        } else if(errorCode == 500) {
            res.statusMessage = "Internal server error";
            res.status(500).send("Internal server error: There was a problem getting information from the server.");
        }
    });
};

exports.updateInformationOnAuction = function(req, res) {
    let auctionId = req.params.auctionId;
    lib.checkAuthenticated(req, res, function(isAuthenticated) {
        if(isAuthenticated) {

            let values = {};

            if(req.body.categoryId) {
                values["auction_categoryid"] = req.body.categoryId;
            }

            if(req.body.title) {
                values["auction_title"] = req.body.title;
            }

            if(req.body.description) {
                values["auction_description"] = req.body.description;
            }

            if(req.body.startDateTime) {
                let startDate = new Date(parseInt(req.body.startDateTime));
                startDate = datetime.create(startDate).format('Y-m-d H:M:S');
                values["auction_startingdate"] = startDate;
            }

            if(req.body.endDateTime) {
                let endDate = new Date(parseInt(req.body.endDateTime));
                endDate = datetime.create(endDate).format('Y-m-d H:M:S');
                values["auction_endingdate"] = endDate;
            }

            if(req.body.reservePrice) {
                values["auction_reserveprice"] = req.body.reservePrice;
            }

            if(req.body.startingBid) {
                values["auction_startingprice"] = req.body.startingBid;
            }

            let token = req.header("X-Authorization");
            User.getUserIdFromToken(token, function (userId, errorCode) {
                if (errorCode == 500) {
                    res.statusMessage = "Internal server error.";
                    res.status(500).send(`Internal Server Error: A problem occurred getting information from the database.`);
                } else {
                    Auction.updateInformation(auctionId, userId, values, function(result, errorCode) {
                        if(errorCode == 201) {
                            res.statusMessage = "OK";
                            res.status(201).send(`Successfully updated auction with id ${auctionId}`);
                        } else if(errorCode == 400) {
                            res.statusMessage = "Bad request";
                            res.status(400).send(result);
                        } else if(errorCode == 403) {
                            res.statusMessage = "Forbidden";
                            res.status(403).send("Forbidden - bidding has begun on the auction");
                        } else if(errorCode == 404) {
                            res.statusMessage = "Not found";
                            res.status(404).send(`Not found: The auction with id ${auctionId} could not be found`);
                        } else if(errorCode == 500) {
                            res.statusMessage = "Internal server error";
                            res.status(500).send("Internal Server Error: There was a problem updating information in the database");
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

exports.getBidsForSingleAuction = function(req, res) {
    let auctionId = req.params.auctionId;
    Auction.getBids(auctionId, function(result, errorCode) {
        if(errorCode == 200) {
            res.statusMessage = "OK";
            res.status(200).send(result);
        } else if(errorCode == 400) {
            res.statusMessage = "Bad Request.";
            res.status(400).send("Bad request: A bad request was sent from the user.");
        } else if (errorCode == 404) {
            res.statusMessage = "Not found";
            res.status(404).send(`Not found: Bids on auction with id ${auctionId} were not found`);
        } else if(errorCode == 500) {
            res.statusMessage = "Internal Server Error";
            res.status(500).send("Internal server error: A problem occured getting information from the server.");
        }
    });
};

exports.makeBidForSingleAuction = function(req, res) {
    lib.checkAuthenticated(req, res, function(isAuthenticated) {
        if(isAuthenticated) {

            let auctionId = req.params.auctionId;
            let amount = req.query.amount;
            let token = req.header("X-Authorization");
            User.getUserIdFromToken(token, function (user_id, errorCode) {
                if (errorCode == 500) {
                    res.statusMessage = "Internal server error.";
                    res.status(500).send(`Internal Server Error: A problem occurred getting information from the database.`);
                } else {

                    Auction.makeBid(auctionId, user_id, amount, function(result, errorCode) {
                        if(errorCode == 201) {
                            res.statusMessage = "OK";
                            res.status(201).send(`Bid of $${amount} successfully made on auction with id: ${auctionId} by user id: ${user_id}`);
                        } else if(errorCode == 400) {
                            res.statusMessage = "Bad Request";
                            res.status(400).send(result);
                        } else if(errorCode == 404) {
                            res.statusMessage = "Not found";
                            res.status(404).send("Not found: An auction with this id was not found.");
                        } else if(errorCode == 500) {
                            res.statusMessage = "Internal Server Error";
                            res.status(500).send("Internal Server Error: A problem occurred at the database level.");
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
