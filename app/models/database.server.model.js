const db = require("../../config/db");
const fs = require('fs');
const path = require('path');

exports.resampleData = function(done) {

    let sql = fs.readFileSync('load_data.sql').toString();
    db.get_pool().query(sql,
        function(err, rows){
        if(err) return done(err, 500);
        return done(rows, 201);
    });

};

exports.resetDatabase = function(done) {

    findRemoveSync(path.resolve(_dirname + "/../photos"), {
        extensions: ['.png', '.jpeg'],
        ignore: 'default.png'
    });

    let sql = fs.readFileSync('create_database.sql').toString();
    db.get_pool().query(sql,
        function(err, rows) {
        if(err) return done(err, 500);
        return done(rows, 200);

    });


};