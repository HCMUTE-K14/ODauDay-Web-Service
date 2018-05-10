const Express = require('express');

const AdminController = require('../controller/admin.controller');

const Router = Express.Router();
Router.route('/property')
    .get(AdminController.getPropertyByAdmin);

module.exports = Router;