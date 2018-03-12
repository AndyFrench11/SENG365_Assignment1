const db = require("../../config/db");

exports.getSingleUser = function(userId, done) {
    db.get_pool().query("SELECT * FROM auction_user WHERE user_id = ?", userId,
        function(err, rows){
            if(err) return done({"ERROR": "Error selecting a single user"});
            return done(rows);
        });
};

exports.insert = function(values, done) {
    db.get_pool().query("INSERT INTO auction_user (user_username, user_givenname, user_familyname, user_email," +
        " user_password)  VALUES (?, ?, ?, ?, ?)", values,
        function(err, rows) {
            if(err) {
                console.log(err);
                return done({"ERROR": "Error inserting user into database"});
            }

            return done(rows);
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


