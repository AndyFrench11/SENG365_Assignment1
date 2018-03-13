const db = require("../../config/db");
const fs = require('fs');

exports.resampleData = function(done) {

    let sql = fs.readFileSync('create_database.sql').toString();
    db.get_pool().query(sql,
        function(err, rows){
        if(err) return done(err, true);
        return done(rows, false);
    });

};

exports.resetDatabase = function(done) {
    let sql = fs.readFileSync('load_data.sql').toString();
    db.get_pool().query(sql,
        function(err, rows) {
        if(err) return done(err, true);
        return done(rows, false);

    });


};