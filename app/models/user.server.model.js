const db = require("../../config/db");

exports.getSingleUser = function(isUser, userId, done) {
    if(isUser) {
        db.get_pool().query("SELECT user_username AS username, user_givenname AS givenName, user_familyname AS familyName," +
            "user_email AS email, user_accountbalance AS accountBalance, user_reputation AS reputation FROM auction_user WHERE user_id = ?", userId,
            function(err, rows){
                if((err) || (rows.length == 0)) return done(err, true);
                return done(rows, false);
            });
    } else {
        db.get_pool().query("SELECT user_username AS username, user_givenname AS givenName, user_familyname AS familyName," +
            " user_reputation AS reputation FROM auction_user WHERE user_id = ?", userId,
            function(err, rows){
                if((err) || (rows.length == 0)) return done(err, true);
                return done(rows, false);
            });
    }

};

exports.insert = function(values, done) {
    db.get_pool().query("INSERT INTO auction_user (user_username, user_givenname, user_familyname, user_email," +
        " user_password)  VALUES (?, ?, ?, ?, ?)", values,
        function(err, rows) {
            if(err) {
                return done(err, 400);
            }
            let user_email = values[3];
            let user_password = values[4];
            let sql = `SELECT user_id FROM auction_user WHERE user_email = "${user_email}" AND user_password = "${user_password}"`;
            console.log(sql);
            db.get_pool().query(sql,
                function(err, rows) {
                    if((err) || (rows.length == 0)) {
                        return done(err, 500);
                    }
                    let user_id = rows[0].user_id;
                    console.log(user_id);
                    return done({
                        "id": user_id
                    }, 200);
                });
        });
};

exports.update = function(userId, values, done) {

    let setString = "";
    for(let key in values) {
        let value = values[key];
        setString += `${key} = "${value}", `;
    }

    setString = setString.substring(0, setString.length - 2);

    db.get_pool().query(`UPDATE auction_user SET ${setString} WHERE user_id = "${userId}"`,
        function(err, rows) {
            if(err) {
                return done(err, 500);
            }
            return done(rows, 200);

        });
};

exports.sendLoginDetails = function(values, done) {
    let selectString = "";
    let valueString = "";
    for(let key in values) {
        let value = values[key];
        selectString += `${key}, `
        valueString += `${key} = "${value}" AND `
    }
    selectString = selectString.substring(0, selectString.length - 2);
    valueString = valueString.substring(0, valueString.length - 5);

    let sql = `SELECT (${selectString}, user_id) FROM auction_user WHERE ${valueString}`;

    db.get_pool().query(`SELECT (user_id) FROM auction_user WHERE ${valueString}`,
        function(err, rows) {
            if((err) || rows.length == 0) {
                return done(err, 400);
            }
            console.log(rows);
            let token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
            let user_id = rows[0].user_id;
            console.log(user_id);
            console.log(token);
            db.get_pool().query(`UPDATE auction_user SET user_token = "${token}" WHERE ${valueString}`,
                function(err, rows) {
                    if(err) {
                        console.log(err);
                        return done(err, 500);
                    }
                    return done({
                        "id": user_id,
                        "token": token
                    }, 200);

                })
        })
};

exports.getUserToken = function(token, done) {
    let sql = `SELECT * FROM auction_user WHERE user_token = "${token}"`;
    db.get_pool().query(sql,
        function(err, rows) {
            if((err) || (rows.length == 0)) {
                return done(err, 500);
            }
            return done(rows, 200);
        });

};

exports.getUserIdCheck = function(token, userId, done) {
    let sql = `SELECT user_id FROM auction_user WHERE user_token = "${token}"`;
    db.get_pool().query(sql,
        function(err, rows) {
            if((err) || (rows.length == 0)) {
                return done(err, 500);
            }
            if(userId == rows[0].user_id) {
                return done(rows, 200);
            } else {
                return done(err, 500);
            }
        });
};

exports.getUserIdFromToken = function(token, done) {
    let sql = `SELECT user_id FROM auction_user WHERE user_token = "${token}"`;
    db.get_pool().query(sql,
        function(err, rows) {
            if((err) || (rows.length == 0)) {
                return done(err, 500);
            }
                return done(rows[0].user_id, 200);
        });
};

exports.sendLogoutDetails = function(token, done) {
    db.get_pool().query(`UPDATE auction_user SET user_token = NULL WHERE user_token = "${token}"`,
        function(err, rows) {
            if(err) {
                return done(err, 500);
            }
            return done(rows, 200);
        });
};


