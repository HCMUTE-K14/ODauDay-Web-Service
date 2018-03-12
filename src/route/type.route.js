const Express = require("express");
const TypeController = require("../controller/type.controller");
const Router = Express.Router();
Router.route('/')
    .get(TypeController.getAll)
    .post(TypeController.create)
    .put(TypeController.update)
    .delete(TypeController.destroy)

module.exports = Router;