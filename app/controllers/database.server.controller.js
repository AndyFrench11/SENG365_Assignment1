const database = require('../models/database.server.model');

exports.resample = function(req, res) {
    database.resampleData(function(result, errorCode) {
        if(errorCode == 500) {
            res.statusMessage = "Internal Server Error";
            res.status(500).send("Internal Server Error: There was an error with resampling the data." +
                " Do not try to resample data that has already been resampled.");
        } else if(errorCode == 201) {
            res.statusMessage = "OK";
            res.status(201).send("Sample of data has been reloaded.")
        } else {
            res.statusMessage = "Bad Request";
            res.status(400).send("Bad Request: An attempt to input a request here was issued. Leave the body blank.");

        }
    });
};

exports.reset = function(req, res) {
    database.resetDatabase(function(result, errorCode) {
        if(errorCode == 500) {
            res.statusMessage = "Internal Server Error";
            res.status(500).send("Internal Server Error: An error with the database occurred.");
        } else if(errorCode == 200) {
            res.statusMessage = "OK";
            res.status(200).send("OK: Successfully reset the database!");
        } else {
            res.statusMessage = "Bad request";
            res.status(400).send("Bad request.");
        }
    });
};

