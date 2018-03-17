const Express = require('express');

const AuthController = require('../controller/auth.controller');

const Router = Express.Router();

Router.route('/')
    .post(AuthController.login);


// Router.route('/facebook')
//     .post(UserController.login);



module.exports = Router;