const Express = require("express");
const DirectionController = require("../controller/direction.controller");
const Router = Express.Router();

Router.route("/")
    .get(DirectionController.get)
 
module.exports = Router;
