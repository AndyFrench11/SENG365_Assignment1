const databases = require("../controllers/database.server.controller");

module.exports = function(app) {
    app.route('/api/v1/resample')
        .post(databases.resample);

    app.route('/api/v1/reset')
        .post(databases.reset);

};