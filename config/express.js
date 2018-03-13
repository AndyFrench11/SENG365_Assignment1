const bodyParser = require('body-parser');
const express = require('express');

module.exports = function() {

    const app = express();
    app.use(bodyParser.json());

    require('../app/routes/user.server.routes.js')(app);
    require('../app/routes/database.server.routes.js')(app);
    require('../app/routes/auction.server.routes.js')(app);
    require('../app/routes/photo.server.routes.js')(app);

    return app;

};


