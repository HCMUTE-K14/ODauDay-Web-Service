const JWT = require('jsonwebtoken');

const User = require('../../model/index').User;

const ResponseModel = require('../../util/response-model');
const VerifyUtils = require('../../util/verify-request');
const NumberUtils = require('../../util/number-utils');
const MessageHelper = require('../../util/message/message-helper');
const EmailHelper = require('../../util/email-helper');
const TextUtils = require('../../util/text-utils');
const Template = require('../../util/template');

const Config = require('../../config');
const Logger = require('../../logger');

const Handler = require('../handling-helper');

const UserController = {};

/* Public Request */
UserController.login = login;
UserController.create = register;
UserController.forgotPassword = forgotPassword;

/* Protect Request */
UserController.update = update;
UserController.changePassword = changePassword;

module.exports = UserController;

function login(req, res) {
	VerifyUtils
		.verifyPublicRequest(req)
		.then(isAccess => {
			let query = { email: req.body.email };
			let password = req.body.password;

			User.findOne({
					where: query,
					attributes: {
						exclude: ['date_created', 'date_modified']
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
					if (error.constructor.name === 'ConnectionRefusedError') {
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
		.then(data => {
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
					if (error.constructor.name === 'ConnectionRefusedError') {
						Handler.cannotConnectDatabase(req, res);
					} else if (error.constructor.name === 'ValidationError' ||
						error.constructor.name === 'UniqueConstraintError') {
						Handler.validateError(req, res, error);
					} else {
						handlingCannotRegister(req, res);
					}
				})
		})
		.catch(() => {
			//BAD REQUEST
			Handler.invalidApiKey(req, res);
		});
}

function update(req, res) {
	VerifyUtils
		.verifyProtectRequest(req)
		.then(data => {
			let userIdFromHeader = data.user.id;
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

			User.update(user, { where: query })
				.then(data => {
					res.status(200).json(new ResponseModel({
						code: 200,
						status_text: 'OK',
						success: true,
						data: getMessage(req, 'update_user_successful')
					}));
				})
				.catch(error => {
					if (error.constructor.name === 'ConnectionRefusedError') {
						Handler.cannotConnectDatabase(req, res);
					} else if (error.constructor.name === 'ValidationError' ||
						error.constructor.name === 'UniqueConstraintError') {
						Handler.validateError(req, res, error);
					} else {
						handlingCannotUpdateUser(req, res);
					}
				})
		})
		.catch(() => {
			Handler.invalidAccessToken(req, res);
		})
}

function changePassword(req, res) {
	VerifyUtils
		.verifyProtectRequest(req)
		.then(data => {
			let user = req.body;
			let userIdFromHeader = data.user.id;

			if (user.id !== userIdFromHeader) {
				handlingInvalidUpdateRequest(req, res);
				return;
			}

			let oldPassword = user.old_password;
			let newPassword = user.new_password;

			User.findById(user.id)
				.then(userExists => {
					if (userExists.status === 'disabled') {
						handlingUserIsDisabled(req, res);
						return;
					}
					userExists.comparePassword(oldPassword, userExists.password)
						.then(isMatch => {
							if (isMatch) {
								let query = { id: user.id };
								let update = { password: newPassword, ping_number: NumberUtils.random4Digit() };

								userExists.update(update, { where: query })
									.then(data => {
										res.status(200).json(new ResponseModel({
											code: 200,
											status_text: 'OK',
											success: true,
											data: getMessage(req, 'update_user_successful')
										}));
									})
									.catch(error => {
										if (error.constructor.name === 'ConnectionRefusedError') {
											Handler.cannotConnectDatabase(req, res);
										} else if (error.constructor.name === 'ValidationError' ||
											error.constructor.name === 'UniqueConstraintError') {
											Handler.validateError(req, res, error);
										} else {
											handlingCannotUpdateUser(req, res);
										}
									});
							} else {
								handlingCannotUpdateUser(req, res);
							}
						})
						.catch(error => {
							handlingCannotUpdateUser(req, res);
						});
				})
				.catch(error => {
					if (error.constructor.name === 'ConnectionRefusedError') {
						Handler.cannotConnectDatabase(req, res);
					} else {
						handlingUserNotExists(req, res);
					}
				});
		})
		.catch(() => {
			Handler.invalidAccessToken(req, res);
		});
}

function forgotPassword(req, res) {
	VerifyUtils
		.verifyPublicRequest(req)
		.then(data => {
			let email = req.body.email;
			let query = { email: email };
			User.findOne({ where: query })
				.then(userExists => {
					let linkForgotPassword = TextUtils.generateLinkForgotPassword(userExists);
					let template = Template.forgotPasswordMailTemplate(linkForgotPassword);
					let mailOption = EmailHelper.createMailOptions({
						to: email,
						subject: 'Change Password account ODauDay',
						html: template
					});
					EmailHelper.send(mailOption)
						.then(success => {
							res.status(200).json(new ResponseModel({
								code: 200,
								status_text: 'OK',
								success: true,
								data: [getMessage(req, 'please_check_email_cofirm_password')]
							}));
						})
						.catch(error => {
							handlingSentFailForgotPsaswordEmail(req, res);
						});
				})
				.catch(error => {
					handlingInvalidUpdateRequest(req, res);
				});
		})
		.catch(() => {
			Handler.invalidApiKey(req, res);
		});
}

function disableUser(req, res) {
	VerifyUtils
		.verifyProtectRequest(req)
		.then(data => {
			let userIdFromPathParam = req.params.id;
			let userIdFromHeader = data.user.id;

			if (userIdFromHeader !== userIdFromHeader) {
				handlingInvalidUpdateRequest(req, res);
				return;
			}
			let query = { id: userIdFromPathParam };
			User.update({ status: 'disabled' }, { where: query })
				.then(data => {
					res.status(200).json(new ResponseModel({
						code: 200,
						status_text: 'OK',
						success: true,
						data: [getMessage(req, 'update_user_successful')]
					}));
				})
				.catch(error => {
					if (error.constructor.name === 'ConnectionRefusedError') {
						Handler.cannotConnectDatabase(req, res);
					} else if (error.constructor.name === 'ValidationError' ||
						error.constructor.name === 'UniqueConstraintError') {
						Handler.validateError(req, res, error);
					} else {
						handlingCannotUpdateUser(req, res);
					}
				})
		})
		.catch(() => {
			Handler.invalidAccessToken(req, res);
		})
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

function handlingUserIsDisabled(req, res) {
	build503Response(req, res, 'user_is_disabled');
}

function handlingSentFailForgotPsaswordEmail(req, res) {
	build503Response(req, res, 'sent_mail_fail');
}

function handlingLoginFailure(req, res) {
	build503Response(req, res, 'login_failure');
}

function handlingCannotUpdateUser(req, res) {
	build503Response(req, res, 'update_user_fail');
}

function handlingUserNotExists(req, res) {
	build503Response(req, res, 'login_failure');
}

function handlingInvalidUpdateRequest(req, res) {
	build503Response(req, res, 'update_user_request_invalid');
}

function handlingCannotRegister(req, res) {
	build503Response(req, res, 'cannot_register');
}

function build503Response(req, res, errorText) {
	res.status(503).json(new ResponseModel({
 		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, errorText)]
	}));
}

function getMessage(req, errorText) {
	let lang = req.query.lang || 'vi';
	return MessageHelper.getMessage(lang, errorText);
}