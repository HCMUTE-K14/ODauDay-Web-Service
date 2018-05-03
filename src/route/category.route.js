const Express = require("express");
const CategoryController = require("../controller/category.controller");
const Router = Express.Router();

Router.route("/")
    .get(CategoryController.getAll)
    .post(CategoryController.create)
    .put(CategoryController.update)
    .delete(CategoryController.destroy);

module.exports = Router;
