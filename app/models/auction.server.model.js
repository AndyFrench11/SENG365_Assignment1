const db = require("../../config/db");

exports.getAll = function(done) {
    //TODO Yet to be implemented
};

exports.create = function(values, done) {
    db.get_pool().query("INSERT INTO auction (auction_categoryid, auction_title, auction_description, auction_startingdate," +
        " auction_endingdate, auction_reserveprice, auction_startingprice, auction_userid)  VALUES (?, ?, ?, ?, ?, ?, ?, ?)", values,
        function(err, rows) {
        
            if(err) {
                return done(err, 400);
            }
            let sql = "SELECT auction_id FROM auction WHERE auction_categoryid = ? AND auction_title = ? AND " +
                "auction_description = ? AND auction_startingdate = ? AND auction_endingdate = ? AND " +
                "auction_reserveprice = ? AND auction_startingprice = ? AND auction_userid = ?";
            db.get_pool().query(sql, values,
                function(err, rows) {
                    if((err) || (rows.length == 0)) {
                        return done(err, 500);
                    }
                    let auction_id = rows[0].auction_id;
                    return done({
                        "id": auction_id
                    }, 201);
                });
        });
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
