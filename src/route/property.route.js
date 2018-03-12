const Express = require("express");
const PropertyController = require("../controller/property.controller");
const Router = Express.Router();
Router.route('/')
    .get(PropertyController.getAll)
    .post(PropertyController.create)
    .put(PropertyController.update)
    .delete(PropertyController.destroy)

module.exports = Router;