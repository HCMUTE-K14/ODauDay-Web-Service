const Express = require("express");
const PropertyController = require("../controller/property.controller");
const Router = Express.Router();
Router.route('/')
    .get(PropertyController.getAll)
    .post(PropertyController.create)
    .put(PropertyController.update)
    .delete(PropertyController.destroy)
Router.route('/user')
    .get(PropertyController.getPropertyByUser)

module.exports = Router;