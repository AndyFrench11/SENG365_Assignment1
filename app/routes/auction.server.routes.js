const auctions = require('../controllers/auction.server.controller');

module.exports = function(app) {
    app.route('/api/v1/auctions')
        .get(auctions.getAllAuctions)
        .post(auctions.createAuction);

    app.route('/api/v1/auctions/:auctionId')
        .get(auctions.getAuction)
        .patch(auctions.updateInformationOnAuction);

    app.route('/api/v1/auctions/:auctionId/bids')
        .get(auctions.getBidsForSingleAuction)
        .post(auctions.makeBidForSingleAuction);

};