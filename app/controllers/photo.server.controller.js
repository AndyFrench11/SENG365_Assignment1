const Photo = require("../models/photo.server.model");
const fs = require("fs");

exports.getAllPhotosFromAuction = function(req, res) {
    let auctionId = req.params.auctionId;
    Photo.getAllPhotos(auctionId, function(result, error) {
        if(error) {
            res.statusMessage = "Not found";
            res.status(404).send("Not found: Photos from Auction not found.")
        } else {
            res.statusMessage = "OK";
            res.status(200).json(result);
        }
    });
};

exports.addPhotoToAuction = function(req, res) {
    let auction_id = req.params.auctionId;
    let photo_data = {
        photo_image_URI: req.body.photo_image_URI,
        photo_displayorder: req.body.photo_displayorder
    };

    let photoImageURI = photo_data["photo_image_URI"].toString();
    let photoDisplayOrder = photo_data["photo_displayorder"].toString();

    let values = [
        [auction_id],
        [photoImageURI],
        [photoDisplayOrder]
    ];

    Photo.addPhoto(values, function(result, error) {
        if(error) {
            res.statusMessage = "Not found";
            res.status(404).send(`Not found: Could not add photo (${photoImageURI}) to auction ${auction_id}`);
        } else {
            res.statusMessage = "OK";
            res.status(201).send(`Successfully added photo (${photoImageURI}) to auction ${auction_id}`);
        }
    });
};

exports.getSinglePhotoFromAuction = function(req, res) {
    let auction_id = req.params.auctionId;
    let photo_id = req.params.photoId;

    //req.pipe(fs.createWriteStream("../photos"));

    Photo.getSinglePhoto(auction_id, photo_id, function(result, error) {
        if(error) {
            res.statusMessage = "Not found";
            res.status(404).send(`Not found: Could not get photo with id:${photo_id} in auction id:${auction_id}`);
        } else {
           res.statusMessage = "OK";
           res.status(200).json(result);
        }
    });
};

exports.updatePhotoFromAuction = function(req, res) {
    let auction_id = req.params.auctionId;
    let photo_id = req.params.photoId;
    let photo_data = {
        photo_image_URI: req.body.photo_image_URI,
        photo_displayorder: req.body.photo_displayorder
    };

    let photoImageURI = photo_data["photo_image_URI"].toString();
    let photoDisplayOrder = photo_data["photo_displayorder"].toString();

    let values = [
        [photoImageURI],
        [photoDisplayOrder],
        [photo_id],
        [auction_id]
    ];

    Photo.updatePhoto(values, function(result, error) {

        //TODO Authorization
        if(error) {
            res.statusMessage = "Not found";
            res.status(404).send(`Not found: Could not get photo with id:${photo_id} in auction id:${auction_id}`);
        } else {
            res.statusMessage = "OK";
            res.status(201).send(`Photo (id: ${photo_id}) successfully updated from auction id: ${auction_id}`);
        }
    });
};

exports.deleteAuctionPhoto = function(req, res) {
    let auction_id = req.params.auctionId;
    Photo.deletePhoto(auction_id, function(result) {
        res.statusMessage = "OK";
        res.status(201).send(`Photo (id: ${photo_id}) successfully deleted from auction id: ${auction_id}`);
    });
};