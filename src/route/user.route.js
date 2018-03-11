const Express = require('express');

const UserController = require('../controller/user.controller');
const ActiveAccountController = require('../controller/active-account.controller');

const Router = Express.Router();

Router.route('/registration')
	.post(UserController.create);

// Router.route('/:id')
// 	.put() //update Profile 

// Router.route('/change-password')
//	.post() //change password

Router.route('/active')
	.get(ActiveAccountController.active) //Active account

Router.route('/resend-activation')
	.post(ActiveAccountController.resendActivation);

// Router.route('/forgot-password')
// 	.post()

module.exports = Router;