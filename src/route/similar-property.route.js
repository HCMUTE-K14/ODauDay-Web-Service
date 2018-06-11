const Express = require('express');
const SimilarPropertyController = require("../controller/similar-property.controller");
const Router = Express.Router();
Router.route('/:id')
	.get(SimilarPropertyController.get);


module.exports = Router;