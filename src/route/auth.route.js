const Express = require('express');

const UserController = require('../controller/user.controller');

const Router = Express.Router();

Router.route('/')
    .post(UserController.login)


// Router.route('/facebook')
//     .post(UserController.login);



module.exports = Router;