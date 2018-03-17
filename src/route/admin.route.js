const Express = require('express');

const AdminController = require('../controller/admin.controller');

const Router = Express.Router();

// Router.route('/disableAccount')
//     .post(UserController.login) 

Router.route('/users')
    .get(AdminController.getUsers);


module.exports = Router;