const Auction = require("../models/auction.server.model");

exports.getAllAuctions = function(req, res) {
    //TODO Yet to be implemented
    Auction.getAll();
};

exports.createAuction = function(req, res) {
    //TODO Yet to be implemented
    Auction.create();
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
