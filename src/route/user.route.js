const Express = require('express');

const AuthController = require('../controller/auth.controller');
const UserController = require('../controller/user.controller');

const ActiveAccountController = require('../controller/active-account.controller');

const Router = Express.Router();

Router.route('/registration')
	.post(AuthController.register);

Router.route('/:id')
	.put(UserController.changeProfile); //update Profile 

Router.route('/change-password')
	.post(UserController.changePassword); //change password

Router.route('/active')
	.get(ActiveAccountController.active); //Active account

// Router.route('/resend-activation')
// 	.post(ActiveAccountController.resendActivation);

// Router.route('/forgot-password')
// 	.post(UserController.forgotPassword);

// Router.route('/confirm-password-change')
// 	.get(ActiveAccountController.confirmPasswordChange);

// Router.route('/receive-new-password')
// 	.post(ActiveAccountController.receiveNewPassword);


module.exports = Router;