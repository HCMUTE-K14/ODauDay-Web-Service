const Express = require('express');

const AdminController = require('../controller/admin.controller');

const Router = Express.Router();
Router.route('/property')
    .get(AdminController.getPropertyByAdmin);
Router.route('/user')
    .get(AdminController.getUserByAdmin);
Router.route('/change-status-user')
    .put(AdminController.changeStatusUser);
Router.route('/change-status-property')
    .put(AdminController.changeStatusProperty);

module.exports = Router;