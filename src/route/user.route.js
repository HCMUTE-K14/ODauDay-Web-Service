const Express = require('express');

const UserController = require('../controller/user.controller');

const Router = Express.Router();

Router.route('/')
    .get(UserController.getByPage)

module.exports = Router;