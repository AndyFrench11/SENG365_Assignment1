const db = require('../../config/db');

exports.getAllPhotos = function(auctionId, done) {
    db.get_pool().query("SELECT photo_image_URI as photoUri FROM photo WHERE photo_auctionid = ?", auctionId,
        function(err, rows) {
            if((err) || (rows.length == 0)) return done(err, true);
            return done(rows, false);
        });
};

exports.addPhoto = function(values, done) {
    db.get_pool().query("INSERT INTO photo (photo_auctionid, photo_image_uri, photo_displayorder) VALUES (?, ?, ?)",
        values, function(err, rows) {
        if(err) {
            return done(err, true);
        }
        return done(rows, false);
    });
};

exports.getSinglePhoto = function(auction_id, photo_id, done) {
    let values = [
        [auction_id],
        [photo_id]
    ];
    db.get_pool().query("SELECT photo_image_URI as photoUri FROM photo WHERE photo_auctionid = ? AND photo_id = ?",
        values, function(err, rows) {
        if((err) || (rows.length == 0)) {
            return done(err, true);
        }
        return done(rows, false);
    });
};

exports.updatePhoto = function(values, done) {
    db.get_pool().query("UPDATE photo SET photo_image_URI = ?, photo_displayorder = ?" +
        " WHERE photo_id = ? AND photo_auctionid = ?", values,
        function(err, rows) {
            if (err) {
                return done(err, true);
            }
            return done(rows, false);
        });
};

exports.deletePhoto = function(auction_id, photo_id, done) {
    db.get_pool().query(`DELETE FROM photo WHERE photo_id = ${photo_id} AND photo_auctionid = ${auction_id}`,
        function(err, rows) {
            if(err) {
                return done(err, true);
            }
            return done(rows, false);
        });
};