const db = require('../../config/db');
const fs = require('fs');


exports.addPhoto = function(user_id, auction_id, done) {

    db.get_pool().query(`SELECT auction_id FROM auction JOIN auction_user ON auction_user.user_id=auction.auction_userid WHERE auction_user.user_id = "${user_id}" AND auction_id = "${auction_id}"`,
        function(err, rows) {
        if(err) {
            return done(err, 500);
        }
        if(rows.length == 0) {
            return done(err, 404);
        }
        console.log(rows[0].auction_id);
        console.log(auction_id);
        if(rows[0].auction_id == auction_id) {
            db.get_pool().query(`SELECT * FROM photo WHERE photo_auctionid = "${auction_id}"`,
                function(err, rows) {
                    if(err) {
                        return done(err, 500);
                    }
                    console.log(rows);
                    if(rows.length != 0) {
                        return done(err, 400);
                    }

                    db.get_pool().query(`INSERT INTO photo (photo_auctionid, photo_image_uri) VALUES ("${auction_id}", "${auction_id}.png")`,
                        function(err, rows) {
                            if(err) {
                                return done(err, 500);
                            }
                            return done(rows, 201);
                        });




                });

        } else {
            return done(err, 401);
        }

        });

    //TODO Add in assumptions list - you must delete an old photo before adding a new one.



};

exports.getSinglePhoto = function(auction_id, done) {
    db.get_pool().query(`SELECT * FROM auction WHERE auction_id = "${auction_id}"`,
        function(err, rows) {
            if((err) || (rows.length == 0)) {
                return done(err, 400);
            }
            db.get_pool().query(`SELECT photo_image_URI FROM photo WHERE photo_auctionid = "${auction_id}"`,
                function(err, rows) {
                    if(err) {
                        return done(err, 500);
                    }
                    if(rows[0] == undefined) {
                        fs.readFile(`./app/photos/default.png`,
                            function(err, result) {
                                if(err) {
                                    return done(err,500);
                                }
                                return done(result, 404);
                            });
                    } else {
                        fs.readFile(`./app/photos/${auction_id}.png`,
                            function(err, result) {
                                if(err) {
                                }
                                return done(result, 200);
                            });
                    }



                });

        });

};

// exports.updatePhoto = function(values, done) {
//     db.get_pool().query("UPDATE photo SET photo_image_URI = ?, photo_displayorder = ?" +
//         " WHERE photo_id = ? AND photo_auctionid = ?", values,
//         function(err, rows) {
//             if (err) {
//                 return done(err, true);
//             }
//             return done(rows, false);
//         });
// };

exports.deletePhoto = function(user_id, auction_id, done) {
    //Check if you are right user
    db.get_pool().query(`SELECT auction_id FROM auction JOIN auction_user ON auction_user.user_id=auction.auction_userid WHERE auction_user.user_id = "${user_id}" AND auction_id = ${auction_id}`,
        function(err, rows) {
            if(err) {
                return done(err, 500);
            }
            if(rows.length == 0) {
                return done(err, 402);
            }
            //Check if the photo is there
            if(rows[0].auction_id == auction_id) {
                db.get_pool().query(`SELECT * FROM photo WHERE photo_auctionid = "${auction_id}"`,
                    function(err, rows) {
                        if(err) {
                            return done(err, 404);
                        }
                        if(rows.length == 0) {
                            return done(err, 400);
                        }
                        //Do deletion
                        db.get_pool().query(`DELETE FROM photo WHERE photo_auctionid = "${auction_id}"`,
                            function(err, rows) {
                                if(err) {
                                    return done(err, 500);
                                }
                                return done(rows, 201);
                            });


                    });

            } else {
                return done(err, 401);
            }

        });

    //TODO Add in assumptions list - you must delete an old photo before adding a new one.
};