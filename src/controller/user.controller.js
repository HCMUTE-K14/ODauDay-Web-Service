const JWT = require('jsonwebtoken');

const User = require('../model/index').User;

const ResponseModel = require('../util/response-model');
const VerifyUtils = require('../util/verify-request');
const NumberUtils = require('../util/number-utils');
const MessageHelper = require('../util/message/message-helper');
const EmailHelper = require('../util/email-helper');

const Config = require('../config');
const Logger = require('../logger');

const Handler = require('./handling-helper');

const UserController = {};

/* Public Request */
UserController.login = login;
UserController.create = register;
// UserController.changePassword = changePassword;
// UserController.forgotPassword = forgotPassword;

/* Protect Request */
// UserController.update = update;

module.exports = UserController;



function login(req, res) {
	VerifyUtils
		.verifyPublicRequest(req)
		.then(isAccess => {
			if (!isAccess) {
				Handler.invalidApiKey(res);
				return;
			}
			let query = { email: req.body.email };
			let password = req.body.password;

			User.findOne({
					where: query,
					attributes: {
						// exclude: ['date_created', 'date_modified']
					}
				})
				.then(user => {
					user.comparePassword(password, user.password)
						.then(isMatch => {
							if (isMatch) {
								//Login success
								handlingLoginSuccessful(res, user);
							} else {
								handlingLoginFailure(req, res);
							}
						})
						.catch(error => {
							handlingLoginFailure(req, res);
						})
				})
				.catch(error => {
					if (error.constructor.name == 'ConnectionRefusedError') {
						Handler.cannotConnectDatabase(req, res);
					} else {
						handlingUserNotExists(req, res);
					}
				})
		})
		.catch(() => {
			Handler.invalidApiKey(req, res);
		});
}


function register(req, res) {
	VerifyUtils
		.verifyPublicRequest(req)
		.then(isAccess => {
			if (!isAccess) {
				Handler.invalidApiKey(res);
				return;
			}
			let user = req.body;

			delete user.status;
			delete user.ping_number;
			delete user.role;

			let randomPing = NumberUtils.random4Digit();
			user.ping_number = randomPing;

			User.create(user)
				.then(data => {
					res.status(200).json(new ResponseModel({
						code: 200,
						status_text: 'OK',
						success: true,
						data: getMessage(req, 'please_check_email_to_active_account')
					}));
					//send mail 
					EmailHelper.sendMailActivateAccount(data);
				})
				.catch(error => {
					if (error.constructor.name == 'ConnectionRefusedError') {
						Handler.cannotConnectDatabase(req, res);
					} else if (error.constructor.name == 'ValidationError' || error.constructor.name == 'UniqueConstraintError') {
						Handler.validateError(req, res, error);
					} else {
						handlingCannotRegister(req, res);
					}
				})
		})
		.catch(() => {
			//BAD REQUEST
			Handler.invalidApiKey(res);
		});
}

function handlingLoginSuccessful(res, user) {
	user.hideSecretInformation();
	let token = JWT.sign({ user: user }, Config.secret_token);
	res.status(200).json(new ResponseModel({
		code: 200,
		status_text: 'OK',
		success: true,
		data: { access_token: token },
		errors: null
	}));
}

function handlingLoginFailure(req, res) {
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'login_failure')]
	}));
}

function handlingUserNotExists(req, res) {
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'login_failure')]
	}));
}

function handlingCannotRegister(req, res) {
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'unknown_message')]
	}));
}


function getMessage(req, errorText) {
	let lang = req.query.lang || 'vi';
	return MessageHelper.getMessage(lang, errorText);
}