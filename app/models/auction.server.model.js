const db = require("../../config/db");
const datetime = require('node-datetime');

exports.getAll = function(parameterValues, done) {
    let sql = "SELECT " +
        "DISTINCT auction_id AS id, " +
        "category.category_title AS categoryTitle, " +
        "auction_categoryid AS categoryId, " +
        "auction_title AS title, " +
        "auction_reserveprice AS reservePrice, " +
        "auction_startingdate AS startDateTime, " +
        "auction_endingdate AS endDateTime, " +
        "MAX(bid.bid_amount) AS currentBid ";

    sql += "FROM auction ";

    sql += "JOIN category ON category.category_id=auction.auction_categoryid ";
    sql += "LEFT JOIN bid ON auction.auction_id=bid.bid_auctionid ";

    sql += "WHERE 1 ";

    if(parameterValues.q) {
        sql += ` AND auction_title LIKE '%${parameterValues.q}%' `;
    }
    if(parameterValues['category-id']) {
        sql += ` AND auction_categoryid = ${parameterValues['category-id']} `;

    }
    if(parameterValues.seller) {

        sql += ` AND auction_userid = ${parameterValues.seller} `;
    }

    if(parameterValues.bidder) {

        sql += ` AND bid.bid_userid = ${parameterValues.bidder} `;

    }

    sql += "GROUP BY id ORDER BY endDateTime ASC";


    if(parameterValues.count) {
        sql += ` LIMIT ${parameterValues.count}`;
    } else {
        sql += ` LIMIT 1000000000000000`;
    }

    if(parameterValues.startIndex) {
        sql += ` OFFSET ${parameterValues.startIndex}`;
    }

    console.log(sql);
    db.get_pool().query(sql,
        function(err, rows) {
            if(err) {
                console.log(err);
                return done("Bad request: Please enter valid inputs.", 400)
            }

            if(rows.length == 0) {
                return done("Bad request: There are no auctions currently created with the given parameters.", 400);
            } else {
                let auctionList = [];
                for (let i = 0; i < rows.length; i++) {
                    let auction = {
                        "id": rows[i].id,
                        "categoryTitle": rows[i].categoryTitle,
                        "categoryId": rows[i].categoryId,
                        "title": rows[i].title,
                        "reservePrice": rows[i].reservePrice,
                        "startDateTime": Date.parse(rows[i].startDateTime),
                        "endDateTime": Date.parse(rows[i].endDateTime),
                        "currentBid": rows[i].currentBid
                    };
                    auctionList[i] = auction;

                }
                return done(auctionList, 200);
            }


        });

};

exports.create = function(values, done) {

    let currentDate = datetime.create();
    if(values[3] > values[4]) {
        return done("Bad request: The end date time of the auction must be after the start date time", 400)
    } else if(values[4] < currentDate) {
        return done("Bad request: The start date time of the auction must be after the current date time", 400)
    }
    let startDate = new Date(parseInt(values[3]));
    startDate = datetime.create(startDate).format('Y-m-d H:M:S');
    let endDate = new Date(parseInt(values[4]));
    endDate = datetime.create(endDate).format('Y-m-d H:M:S');
    values[3] = [startDate];
    values[4] = [endDate];
    db.get_pool().query("INSERT INTO auction (auction_categoryid, auction_title, auction_description, auction_startingdate," +
        " auction_endingdate, auction_reserveprice, auction_startingprice, auction_userid, auction_creationdate)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", values,
        function(err, rows) {

            if(err) {
                console.log(err);
                return done("Bad request: This auction may already exist.", 400);
            }

            let sql = "SELECT MAX(auction_id) AS auction_id FROM auction WHERE auction_categoryid = ? AND auction_title = ? AND " +
                "auction_description = ? AND auction_startingdate = ? AND auction_endingdate = ? AND " +
                "auction_reserveprice = ? AND auction_startingprice = ? AND auction_userid = ?";
            db.get_pool().query(sql, values,
                function(err, rows) {
                    if((err) || (rows.length == 0)) {
                        console.log(err);
                        return done(err, 500);
                    }
                    console.log(rows);
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
            resultValues["startDateTime"] = Date.parse(rows[0].startDateTime);
            resultValues["endDateTime"] = Date.parse(rows[0].endDateTime);
            resultValues["description"] = rows[0].description;
            resultValues["creationDateTime"] = Date.parse(rows[0].creationDateTime);


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
                                    resultValues["currentBid"] = null;
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
                                                "datetime": Date.parse(rows[i].datetime),
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
            console.log("Got here 2");
            if (err) {
                return done(err, 500);
            }
            if(rows.length == 0) {
                return done(err, 404);
            }

            if (rows[0].auction_userid != userId) {

                return done(err, 401);
            }

            //Check if the auction has started

            let currentDate = Date.now();
            let sql = `SELECT auction_startingdate, auction_endingdate, auction_creationdate FROM auction WHERE auction_id = "${auctionId}"`;
            db.get_pool().query(sql,
                function(err, rows) {
                    console.log("Got here 1");
                    if (err) {
                        return done(err, 500);
                    }
                    if (rows.length == 0) {
                        return done(err, 404);
                    }
                    console.log("Got here");
                    if (currentDate > Date.parse(rows[0].auction_startingdate)) {
                        return done("Bad request: You may only update an auction if it hasn't started.", 400);
                    }
                    //Check if dates are valid
                    if(values["auction_startingdate"]) {
                        if(values["auction_startingdate"] < Date.parse(rows[0].auction_creationdate)) {
                            return done("Bad request: The start date time of the auction must be after the creation date time", 400)
                        }
                    }
                    if(values["auction_endingdate"]) {
                        if(values["auction_endingdate"] < Date.parse(rows[0].auction_startingdate)) {
                            return done("Bad request: The end date time of the auction must be after the start date time", 400)
                        }

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
            else {
                let bidList = [];
                for (let i = 0; i < rows.length; i++) {


                    let bid = {
                        "amount": rows[i].amount,
                        "datetime": Date.parse(rows[i].datetime),
                        "buyerId": rows[i].buyerId,
                        "buyerUsername": rows[i].buyerUsername
                    };
                    bidList[i] = bid;
                }
                return done(bidList, 200);

            }

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
            if(rows.length == 0) {
                return done(err, 404);
            }

            if(rows[0].auction_userid == userId) {
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
                    if((currentDate < Date.parse(rows[0].auction_startingdate)) || (currentDate > Date.parse(rows[0].auction_endingdate))) {
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
                            let currentDate = datetime.create().format("Y-m-d H:M:S");
                            let sql = `INSERT INTO bid (bid_userid, bid_auctionid, bid_amount, bid_datetime) VALUES ("${userId}", "${auctionId}", "${amount}", "${currentDate}")`;
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
