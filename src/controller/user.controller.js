const User = require('../model/index').User;

const ResponseModel = require('../util/response-model');
const VerifyUtils = require('../util/verify-request');
const NumberUtils = require('../util/number-utils');
const MessageHelper = require('../util/message/message-helper');
const TextUtils = require('../util/text-utils');
const Template = require('../util/template');
const EmailHelper = require('../util/email-helper');
const Config = require('../config');

const Handler = require('./handling-helper');


const CONFIRM_PASSWORD_SUCCESSFUL = 'confirm_pass_successful';
const CONFIRM_PASSWORD_FAILURE = 'confirm_pass_failure';
const CONFIRM_PASSWORD = 'confirm_password';

const UserController = {};
UserController.changeProfile = changeProfile;
UserController.changePassword = changePassword;
UserController.confirmPasswordChange = confirmPasswordChange;
UserController.receiveNewPassword = receiveNewPassword;
UserController.forgotPassword = forgotPassword;

module.exports = UserController;

async function changeProfile(req, res) {
	try {
		let isAccess = await VerifyUtils.verifyProtectRequest(req);
		let userIdFromHeader = isAccess.user.id;
		let userIdFromPathParam = req.params.id;
		let user = req.body;

		if (userIdFromHeader !== userIdFromPathParam) {
			handlingInvalidUpdateRequest(req, res);
			return;
		}

		let query = { id: userIdFromPathParam };

		delete user.id;
		delete user.status;
		delete user.ping_number;
		delete user.role;
		delete user.password;

		let updated = await User.update(user, { where: query })
		if (updated) {
			res.status(200).json(new ResponseModel({
				code: 200,
				status_text: 'OK',
				success: true,
				data: getMessage(req, 'update_user_successful')
			}));
		} else {
			handlingCannotUpdateUser(req, res);
		}
	} catch (error) {
		if (error.constructor.name === 'ConnectionRefusedError') {
			Handler.cannotConnectDatabase(req, res);
		} else if (error.constructor.name === 'ValidationError' ||
			error.constructor.name === 'UniqueConstraintError') {
			Handler.validateError(req, res, error);
		} else if (error.constructor.name === 'ErrorModel') {
			Handler.invalidAccessToken(req, res);
		} else {
			handlingCannotUpdateUser(req, res);
		}
	}
}

async function changePassword(req, res) {
	try {
		let isAccess = await VerifyUtils.verifyProtectRequest(req);
		let user = req.body;
		let userIdFromHeader = isAccess.user.id;

		if (user.id !== userIdFromHeader) {
			handlingInvalidUpdateRequest(req, res);
			return;
		}
		let oldPassword = user.old_password;
		let newPassword = user.new_password;

		let userExists = await User.findById(user.id);
		if (userExists.status === 'disabled') {
			handlingUserIsDisabled(req, res);
			return;
		}

		let isMatchPassword = await userExists.comparePassword(oldPassword, userExists.password);
		if (isMatchPassword) {
			let query = { id: user.id };
			let update = { password: newPassword, ping_number: NumberUtils.random4Digit() };

			let updated = await userExists.update(update, { where: query })

			if (updated) {
				res.status(200).json(new ResponseModel({
					code: 200,
					status_text: 'OK',
					success: true,
					data: getMessage(req, 'update_user_successful')
				}));
			} else {
				handlingCannotUpdateUser(req, res);
			}

		} else {
			handlingCannotUpdateUser(req, res);
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
			handlingCannotUpdateUser(req, res);
		}
	}
}

async function forgotPassword(req, res) {
	try {
		let isAccess = await VerifyUtils.verifyPublicRequest(req);

		let email = req.body.email;

		let userExists = await User.findOne({ where: { email: email } });

		let linkForgotPassword = TextUtils.generateLinkForgotPassword(userExists);
		let template = Template.forgotPasswordMailTemplate(linkForgotPassword);
		let mailOption = EmailHelper.createMailOptions({
			to: email,
			subject: 'Change Password account ODauDay',
			html: template
		});

		EmailHelper.send(mailOption)
			.then(success => {
				let message = getMessage(req, 'please_check_email_cofirm_password');
				res.status(200).json(new ResponseModel({
					code: 200,
					status_text: 'OK',
					success: true,
					data: message
				}));
			})
			.catch(error => {
				handlingSentFailForgotPsaswordEmail(req, res);
			});
	} catch (error) {
		console.log(error);
		if (error.constructor.name === 'ConnectionRefusedError') {
			Handler.cannotConnectDatabase(req, res);
		} else if (error.constructor.name === 'ValidationError' ||
			error.constructor.name === 'UniqueConstraintError') {
			Handler.validateError(req, res, error);
		} else if (error.constructor.name == 'ErrorModel') {
			Handler.handlingErrorModel(res, error);
		} else {
			handlingSentFailForgotPsaswordEmail(req, res);
		}
	}
}


function confirmPasswordChange(req, res) {
	let token = req.query.token;
	VerifyUtils.verifyWithSecretToken(token)
		.then(data => {
			if (data.data['method'] !== 'forgot_password') {
				render(res, '', CONFIRM_PASSWORD_FAILURE);
				return;
			}
			let user = data.data['user'];

			let timeToExpired = data.data['time_to_expried'].timestamp;

			if (!isExpiredToken(timeToExpired)) {
				render(req, res, user.email, LINK_EXPIRED);
				return;
			}
			render(req, res, '', CONFIRM_PASSWORD);
		})
		.catch(err => {
			console.log(err);
			render(req, res, '', CONFIRM_PASSWORD_FAILURE);
		})
}

function receiveNewPassword(req, res) {
	let token = req.query.token;
	VerifyUtils.verifyWithSecretToken(token)
		.then(data => {

			if (data.data['method'] !== 'forgot_password') {
				render(req, res, '', CONFIRM_PASSWORD_FAILURE);
				return;
			}

			let user = data.data['user'];

			let timeToExpired = data.data['time_to_expried'].timestamp;

			if (!isExpiredToken(timeToExpired)) {
				render(req, res, user.email, LINK_EXPIRED);
				return;
			}
			let query = { id: user.id };
			let hashPingNumber = user.ping_number;

			let newPassword = req.body.password;
			User.findOne({ where: query })
				.then(userExists => {
					let rawPingNumber = Config.secret_token + userExists.ping_number;
					let cadidatePingNumber = TextUtils.hashMD5(rawPingNumber);

					if (hashPingNumber != cadidatePingNumber) {
						render(req, res, user.email, CONFIRM_PASSWORD_FAILURE);
						return;
					}
					userExists.update({ password: newPassword }, { where: query })
						.then(success => {
							render(req, res, user.emaail, CONFIRM_PASSWORD_SUCCESSFUL);
						})
						.catch(error => {
							render(req, res, user.email, CONFIRM_PASSWORD_SUCCESSFUL);
						})
				})
				.catch(error => {
					render(req, res, user.email, CONFIRM_PASSWORD_FAILURE);
				})
		})
		.catch(err => {
			render(req, res, '', CONFIRM_PASSWORD_FAILURE);
		})
}

async function disableUser(req, res) {
	try {
		let isAccess = await VerifyUtils.verifyProtectRequest(req);
		let userIdFromPathParam = req.params.id;
		let userIdFromHeader = data.user.id;

		if (userIdFromHeader !== userIdFromHeader) {
			handlingInvalidUpdateRequest(req, res);
			return;
		}

		let query = { id: userIdFromPathParam };

		let updated = User.update({ status: 'disabled' }, { where: query })
		if (updated) {
			res.status(200).json(new ResponseModel({
				code: 200,
				status_text: 'OK',
				success: true,
				data: [getMessage(req, 'update_user_successful')]
			}));
		} else {
			handlingCannotUpdateUser(req, res);
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
			handlingCannotUpdateUser(req, res);
		}
	}
}

function handlingSentFailForgotPsaswordEmail(req, res) {
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'sent_mail_fail')]
	}));
}

function handlingCannotUpdateUser(req, res) {
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'update_user_fail')]
	}));
}

function handlingInvalidUpdateRequest(req, res) {
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'update_user_request_invalid')]
	}));
}

function handlingUserIsDisabled(req, res) {
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'user_is_disabled')]
	}));
}

function findUserByEmail(email) {
	let query = { email: email };
	return User.findOne({ where: query });
}

function getMessage(req, errorText) {
	let lang = req.query.lang || 'vi';
	return MessageHelper.getMessage(lang, errorText);
}

function isExpiredToken(timeToExpired) {
	let currentTime = new Date().getTime();
	return currentTime <= timeToExpired;
}

function render(req, res, email, type) {
	let template;
	switch (type) {
		case CONFIRM_PASSWORD_SUCCESSFUL:
			template = Template.confirmPasswordSuccessTemplate();
			break;
		case CONFIRM_PASSWORD_FAILURE:
			template = Template.cofirmPasswordFailTemplate();
			break;
		case CONFIRM_PASSWORD:
			let urlResend = Config.base_url + '/users/receive-new-password?token=' + req.query.token;
			template = Template.confirmPasswordTemplate(urlResend);
			break;
		default:
			break;
	}
	res.send(template);
}