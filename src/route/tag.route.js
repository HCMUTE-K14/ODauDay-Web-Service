const Express = require("express");
const TagController = require("../controller/tag.controller");
const Router = Express.Router();
Router.route('/')
    .get(TagController.getAll)
    .post(TagController.create)
    .put(TagController.update)
    .delete(TagController.destroy)

module.exports = Router;