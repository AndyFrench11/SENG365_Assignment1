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

exports.getSingleAuction = function(auctionId, done) {
    //Get first half of the query
    let resultValues = {};

    let sql = "SELECT " +
        "auction_categoryid AS categoryId, " +
        "category.category_title AS categoryTitle, " +
        "auction_title AS title, " +
        "auction_reserveprice AS reservePrice, " +
        "auction_startingdate AS startDateTime, " +
        "auction_endingdate AS endDateTime, " +
        "auction_description AS description, " +
        "auction_creationdate AS creationDateTime " +
        "FROM auction " +
        "JOIN category ON category.category_id=auction.auction_categoryid " +
        "WHERE " +
        "auction_id = " + auctionId;


    db.get_pool().query(sql,
        function(err, rows) {
        if(err) {
            console.log(err);
            return done(err, 500);
        }
        if(rows.length == 0) {
            return done(err, 404);
        }

        //Get values out

            resultValues["categoryId"] = rows[0].categoryId;
            resultValues["categoryTitle"] = rows[0].categoryTitle;
            resultValues["title"] = rows[0].title;
            resultValues["reservePrice"] = rows[0].reservePrice;
            resultValues["startDateTime"] = rows[0].startDateTime;
            resultValues["endDateTime"] = rows[0].endDateTime;
            resultValues["description"] = rows[0].description;
            resultValues["creationDateTime"] = rows[0].creationDateTime;

        //Get the seller sql

        let sellerSql = "SELECT " +
            "auction_userid AS id, " +
            "auction_user.user_username AS username " +
            "FROM auction " +
            "JOIN auction_user ON auction_user.user_id=auction.auction_userid " +
            "WHERE auction_id = " + auctionId;

        db.get_pool().query(sellerSql,
            function(err, rows) {
                if(err) {
                    console.log(err);
                    return done(err, 500);
                }

                //Get values out

                resultValues["seller"] = {
                    "id": rows[0].id,
                    "username": rows[0].username
                };

                //Get startingBid from query

                db.get_pool().query(`SELECT auction_startingprice FROM auction WHERE auction_id = ${auctionId}`,
                    function(err, rows) {
                        if(err) {
                            console.log(err);
                            return done(err, 500);
                        }

                        //Get values out

                        resultValues["startingBid"] = rows[0].auction_startingprice;

                        //Get currentBid

                        db.get_pool().query(`SELECT MAX(bid_amount) AS maxBid FROM bid WHERE bid_auctionid = ${auctionId}`,
                            function(err, rows) {
                                if(err) {
                                    console.log(err);
                                    return done(err, 500);
                                }
                                
                                //Get values out

                                if(rows[0].maxBid == null) {
                                    let startingBid = resultValues["startingBid"];
                                    resultValues["currentBid"] = startingBid;
                                } else {
                                    resultValues["currentBid"] = rows[0].maxBid;
                                }




                                //Add bids sql to result

                                let bidsSql = "SELECT " +
                                    "bid_amount AS amount, " +
                                    "bid_datetime AS datetime, " +
                                    "bid_userid AS buyerId, " +
                                    "auction_user.user_username AS buyerUsername " +
                                    "FROM bid " +
                                    "JOIN auction_user ON auction_user.user_id=bid.bid_userid " +
                                    "WHERE bid_auctionid = " + auctionId;
                                db.get_pool().query(bidsSql,
                                    function(err, rows) {
                                    if(err) {
                                        console.log(err);
                                        return done(err, 500);
                                    }

                                    //Get values out
                                    if(rows.length == 0) {
                                        resultValues["bids"] = [];
                                    } else {
                                        let bidList = [];
                                        for (let i = 0; i < rows.length; i++) {
                                            let bid = {
                                                "amount": rows[i].amount,
                                                "datetime": rows[i].datetime,
                                                "buyerId": rows[i].buyerId,
                                                "buyerUsername": rows[i].buyerUsername
                                            };
                                            bidList[i] = bid;
                                        }
                                        resultValues["bids"] = bidList;
                                    }


                                    return done(resultValues, 200);
                                    });

                            });
                    });
            });
        });

        // });
};

exports.updateInformation = function(auctionId, userId, values, done) {
    //Check if the user requesting the patch is the owner of the auction
    let sql = `SELECT auction_userid FROM auction WHERE auction_id = "${auctionId}"`;
    db.get_pool().query(sql,
        function(err, rows) {
            if (err) {
                return done(err, 500);
            }

            if (rows[0].auction_userid != userId) {
                //TODO Add in assumptions.
                return done("Bad request: You must be the owner of the auction to update its information", 400);
            }

            //Check if the auction has finished
            //TODO Add in assumptions

            let currentDate = Date.now();
            let sql = `SELECT auction_startingdate, auction_endingdate FROM auction WHERE auction_id = "${auctionId}"`;
            db.get_pool().query(sql,
                function(err, rows) {
                    if (err) {
                        return done(err, 500);
                    }
                    if (rows.length == 0) {
                        return done(err, 404);
                    }
                    if (currentDate > rows[0].auction_endingdate) {
                        return done("Bad request: You may only update an auction that is currently active.", 400);
                    }

                    //Check if the bidding on the auction has already begun
                    let sql = `SELECT * FROM bid WHERE bid_auctionid = "${auctionId}"`;
                    db.get_pool().query(sql,
                        function(err, rows) {
                            if(err) {
                                return done(err, 500);
                            }
                            if(rows.length > 0) {
                                return done(err, 403);
                            }

                            //Update the information
                            let setString = "";
                            for(let key in values) {
                                let value = values[key];
                                setString += `${key} = "${value}", `;
                            }

                            setString = setString.substring(0, setString.length - 2);
                            console.log(setString);

                            db.get_pool().query(`UPDATE auction SET ${setString} WHERE auction_id = "${auctionId}"`,
                                function(err, rows) {
                                    if(err) {
                                        return done(err, 500);
                                    }
                                    return done(rows, 201);

                                });

                        });

                });

        });


    //TODO Check if user wants to change dates to invalid days???

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
