const photos = require("../controllers/photo.server.controller");

module.exports = function(app) {
    app.route('/api/v1/auctions/:auctionId/photos')
        .get(photos.getAllPhotosFromAuction)
        .post(photos.addPhotoToAuction);

    app.route('/api/v1/auctions/:auctionId/photos/:photoId')
        .get(photos.getSinglePhotoFromAuction)
        .put(photos.updatePhotoFromAuction)
        .delete(photos.deleteAuctionPhoto);

};