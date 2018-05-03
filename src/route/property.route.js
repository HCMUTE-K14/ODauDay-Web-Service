const Express = require('express');
const PropertyController = require('../controller/property.controller');

const Router = Express.Router();

Router.route('/')
	.post(PropertyController.create)
	.delete(PropertyController.destroy);

Router.route('/user')
	.get(PropertyController.getPropertyByUser);

module.exports = Router;