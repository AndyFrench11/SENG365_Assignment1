const users = require("../controllers/user.server.controller");

module.exports = function(app) {
    app.route('/api/v1/users/:userId')
        .get(users.userById)
        .patch(users.changeDetails);

    app.route('/api/v1/users')
        .post(users.create);

    app.route('/api/v1/users/login')
        .post(users.login);

    app.route('/api/v1/users/logout')
        .post(users.logout);

};