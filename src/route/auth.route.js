const Express = require('express');

const AuthController = require('../controller/auth.controller');

const Router = Express.Router();

Router.route('/')
    .post(AuthController.login);


Router.route('/facebook')
    .post(AuthController.facebook);

module.exports = Router;