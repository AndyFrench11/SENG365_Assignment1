const photos = require("../controllers/photo.server.controller");

module.exports = function(app) {
    app.route('/api/v1/auctions/:auctionId/photos')
        .get(photos.getSinglePhotoFromAuction)
        .post(photos.addPhotoToAuction)
        .delete(photos.deleteAuctionPhoto);


};