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

exports.getBids = function(auctionId, done) {
    let sql = "SELECT bid.bid_amount AS amount, bid.bid_datetime AS datetime, bid.bid_userid AS buyerId, " +
        "auction_user.user_username AS buyerUsername FROM bid JOIN auction_user ON bid.bid_userid=auction_user.user_id " +
        "WHERE bid.bid_auctionid = " + auctionId + " ORDER BY bid.bid_amount DESC";
    db.get_pool().query(sql,
        function(err, rows) {
            if(err) {
                return done(err, 500);
            }
            if(rows.length == 0) {
                return done(err, 404);
            }
            return done(rows, 200);
        });
};

exports.makeBid = function(auctionId, userId, amount, done) {

    //Check user is not bidding on own auction

    let sql = `SELECT auction_userid FROM auction WHERE auction_id = "${auctionId}"`;
    db.get_pool().query(sql,
        function(err, rows) {
            if(err) {
                return done(err, 500);
            }
            // console.log(rows[0].auction_id);
            // console.log(auction);
            if(rows[0].auction_userid == userId) {
                //TODO Add in assumptions.
                return done("Bad request: You cannot bid on your own auction.", 400);
            }

            //Check auction hasn't finished and has started

            let currentDate = Date.now();
            let sql = `SELECT auction_startingdate, auction_endingdate FROM auction WHERE auction_id = "${auctionId}"`;
            db.get_pool().query(sql,
                function(err, rows) {
                    if(err) {
                        return done(err, 500);
                    }
                    if(rows.length == 0) {
                        return done(err, 404);
                    }
                    if((currentDate < rows[0].auction_startingdate) || (currentDate > rows[0].auction_endingdate)) {
                        return done("Bad request: You may only bid on an auction that has started and hasn't finished.", 400);
                    }

                    //Check bid is higher than max bid

                    let sql = `SELECT MAX(bid_amount) AS maxBid FROM bid WHERE bid_auctionid = "${auctionId}"`;
                    db.get_pool().query(sql,
                        function(err, rows) {
                            if(err) {
                                return done(err, 500);
                            }
                            console.log(rows[0].maxBid);
                            console.log(amount);
                            if(rows[0].maxBid > amount) {
                                return done("Bad request: You must place a bid higher than the current maximum bid.", 400);
                            }

                            //ELSE Insert bid into table
                            let sql = `INSERT INTO bid (bid_userid, bid_auctionid, bid_amount, bid_datetime) VALUES ("${userId}", "${auctionId}", "${amount}", "${Date.now()}")`;
                            db.get_pool().query(sql,
                                function(err, rows) {
                                    if(err) {
                                        return done(err, 500);
                                    }
                                    return done(rows, 201);
                                });

                        });


            });


        });

};
