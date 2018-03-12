const database = require('../models/database.server.model');

exports.resample = function(req, res) {
    //TODO Yet to be implemented
    database.resampleData()
};

exports.reset = function(req, res) {
    //TODO Yet to be implemented
    database.resetDatabase();
};

