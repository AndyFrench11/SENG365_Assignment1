const db = require("../../config/db");

exports.getSingleUser = function(userId, done) {
    db.get_pool().query("SELECT user_username AS username, user_givenname AS givenName, user_familyname AS familyName," +
        "user_email AS email, user_accountbalance AS accountBalance FROM auction_user WHERE user_id = ?", userId,
        function(err, rows){
            if((err) || (rows.length == 0)) return done(err, true);
            return done(rows, false);
        });
};

exports.insert = function(values, done) {
    db.get_pool().query("INSERT INTO auction_user (user_username, user_givenname, user_familyname, user_email," +
        " user_password)  VALUES (?, ?, ?, ?, ?)", values,
        function(err, rows) {
            if(err) {
                return done(err, true);
            }
            return done(rows, false);
        });
};

exports.update = function(userId, values, done) {

    let setString = "";
    for(let key in values) {
        let value = values[key];
        setString += `${key} = "${value}", `
    };

    setString = setString.substring(0, setString.length - 2);

    db.get_pool().query(`UPDATE auction_user SET ${setString} WHERE user_id = "${userId}"`,
        function(err, rows) {
            if(err) {
                console.log(err);
                return done({"ERROR" : "Error updating user in database"});
            }

            return done(rows);

        });
};

exports.sendLoginDetails = function(done) {
    //TODO Yet to be implemented
};

exports.sendLogoutDetails = function(done) {
    //TODO Yet to be implemented
};


