const db = require("./config/db");
const express = require("./config/express");

const app = express();

//Connect to MySQL on start
db.connect(function(err) {
    if (err) {
        console.log("Unable to connect to MySQL server!");
        process.exit(1);
    } else {
        app.listen(3003, function() {
            console.log("Successfully connected to Database \n" +
                "Listening on port: 3003 \n" +
                "http://localhost:3003/api/v1/users/2");
        });
    }
});
