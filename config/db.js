const mysql = require('mysql');

let state = {
    pool: null
};

exports.connect = function(done) {
    state.pool = mysql.createPool({
        host: "mysql3.csse.canterbury.ac.nz",
        user: "afr66",
        password: "11147452",
        database: "afr66"
    });
    done();
};

exports.get_pool = function() {
    return state.pool;
};