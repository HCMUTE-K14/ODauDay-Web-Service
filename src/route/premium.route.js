const Express = require('express');
const SubscriptionController = require("../controller/subscription.controller");
const Router = Express.Router();

Router.route('/')
	.get(SubscriptionController.get);
	// .post(SubscriptionController.create)
	// .put(SubscriptionController.update);

// Router.route('/disabled/:id')
// 	.post(SubscriptionController.disable);

Router.route('/subscribe')
	.post(SubscriptionController.subscription);

module.exports = Router;