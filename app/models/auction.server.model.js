const db = require("../../config/db");

exports.getAll = function(done) {
    //TODO Yet to be implemented
};

exports.create = function(done) {
    //TODO Yet to be implemented
};

exports.getSingleOne = function(auctionId, done) {
    db.get_pool().query("SELECT * FROM auction WHERE auction_id = ?", auctionId,
        function(err, rows) {
        if(err) {
            console.log(err);
            return done({"ERROR": "Error getting individual auction"});
        }

        return done(rows);
        });
};

exports.updateInformation = function(done) {
    //TODO Yet to be implemented
};

exports.getBids = function(done) {
    //TODO Yet to be implemented
};

exports.makeBid = function(done) {
    //TODO Yet to be implemented
};
