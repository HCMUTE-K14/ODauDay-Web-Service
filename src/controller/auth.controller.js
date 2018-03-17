const JWT = require('jsonwebtoken');

const User = require('../model/index').User;

const ResponseModel = require('../util/response-model');
const VerifyUtils = require('../util/verify-request');
const NumberUtils = require('../util/number-utils');
const MessageHelper = require('../util/message/message-helper');
const EmailHelper = require('../util/email-helper');

const Config = require('../config')
const Handler = require('./handling-helper');

const AuthController = {};
AuthController.login = login;
AuthController.register = register;

module.exports = AuthController;

async function login(req, res) {
	try {
		let email = req.body.email;
		if (!email) {
			throw new ErrorModel('Email is required');
		}
		let password = req.body.password;
		if (!password) {
			throw new ErrorModel('Password is required');
		}

		let isAccessApiKey = await VerifyUtils.verifyPublicRequest(req);
		if (!isAccessApiKey) {
			throw new ErrorModel('Api key is invalid');
		}
		let user = await findUserByEmail(email);
		let userLoginSuccessfully = await comparePassword(user, password);

		loginSuccessReponse(req, res, userLoginSuccessfully);
	} catch (error) {
		console.log(error.constructor.name);
		if (error.constructor.name === 'ConnectionRefusedError') {
			Handler.cannotConnectDatabase(req, res);
		} else if (error.constructor.name === 'ValidationError' ||
			error.constructor.name === 'UniqueConstraintError') {
			Handler.validateError(req, res, error);
		} else if (error.constructor.name == 'ErrorModel') {
			Handler.handlingErrorModel(res, error);
		} else {
			loginFailureReponse(req, res);
		}
	}
}

async function register(req, res) {
	try {
		let isAccessApiKey = await VerifyUtils.verifyPublicRequest(req);

		if (!isAccessApiKey) {
			throw new ErrorModel('Api key is invalid');
		}

		let user = req.body;
		delete user.status;
		delete user.ping_number;
		delete user.role;

		let randomPing = NumberUtils.random4Digit();
		user.ping_number = randomPing;

		let userCreated = await User.create(user);
		if (userCreated) {
			registerSuccessResponse(req, res);
			EmailHelper.sendMailActivateAccount(userCreated);
		}
	} catch (error) {
		if (error.constructor.name === 'ConnectionRefusedError') {
			Handler.cannotConnectDatabase(req, res);
		} else if (error.constructor.name === 'ValidationError' ||
			error.constructor.name === 'UniqueConstraintError') {
			Handler.validateError(req, res, error);
		} else if (error.constructor.name == 'ErrorModel') {
			Handler.handlingErrorModel(res, error);
		} else {
			loginFailureReponse(req, res);
		}
	}
}





function findUserByEmail(email) {
	let query = { email: email };
	return User.findOne({
		where: query,
		attributes: {
			exclude: ['date_created', 'date_modified']
		}
	});
}

function comparePassword(user, cadidatePassowrd) {
	return new Promise((resolve, reject) => {
		user.comparePassword(cadidatePassowrd, user.password)
			.then(isMatchPassword => {
				if (isMatchPassword) {
					resolve(user);
				} else {
					reject(new Error('EMAIL or password was wrong'));
				}

			})
			.catch(error => reject(error));
	});
}

function loginSuccessReponse(req, res, user) {
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

function registerSuccessResponse(req, res) {
	res.status(200).json(new ResponseModel({
		code: 200,
		status_text: 'OK',
		success: true,
		data: getMessage(req, 'please_check_email_to_active_account')
	}));
}

function registerFailureResponse(req, res) {
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'cannot_register')]
	}));
}

function loginFailureReponse(req, res) {
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'login_failure')]
	}));
}

function getMessage(req, errorText) {
	let lang = req.query.lang || 'vi';
	return MessageHelper.getMessage(lang, errorText);
}