const database = require('../models/database.server.model');

exports.resample = function(req, res) {
    database.resampleData(function(result, error) {
        if(error) {
            res.statusMessage = "Malformed Request";
            res.status(400).send("Malformed Request: There was an error with resampling the data.");
        } else {
            res.statusMessage = "OK";
            res.status(201).send("Successfully resampled!")
        }
    });
};

exports.reset = function(req, res) {
    database.resetDatabase(function(result, error) {
        if(error) {
            res.statusMessage = "Malformed Request";
            res.status(400).send("Malformed Request: There was an error with resetting the database");
        } else {
            res.statusMessage = "OK";
            res.status(200).send("Successfully reset the database!");
        }
    });
};

