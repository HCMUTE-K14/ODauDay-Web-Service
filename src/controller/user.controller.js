const JWT = require('jsonwebtoken');

const User = require('../model/index').User;
const Models = require('../model/index');
const ResponseModel = require('../util/response-model');
const VerifyUtils = require('../util/verify-request');
const TextUtils = require('../util/text-utils');
const MessageHelper = require('../util/message/message-helper');
const Config = require('../config');
const Handler = require('./handling-helper');

const UserController = {};

/* Public Request */
UserController.login = login;
UserController.create = register;
// UserController.changePassword = changePassword;
// UserController.active = active;

/* Protect Request */
// UserController.update = update;
// UserController.disabledUser = disableUser;
// UserController.findById = findById;

/*NEED ADMIN ROLE*/
UserController.getByPage = getByPage;


module.exports = UserController;

function getByPage(req, res) {
	VerifyUtils
		.verifyProtectRequest(req)
		.then(data => {
			if (data.user.role != 'admin') {
				Handler.unAuthorizedAdminRole(req, res);
				return;
			}
			User.findAndCountAll()
				.then((data) => {
					let page = req.query.page || 1;
					let limit = req.query.limit || 5;
					limit = limit <= 0 ? 1 : limit;
					let offset = 0;
					let pages = Math.ceil(data.count / limit);
					offset = limit * (page - 1);
					User.findAll({
							attributes: {
								exclude: ['password', 'ping_number', 'date_created', 'date_modified']
							},
							limit: limit,
							offset: offset,
							$sort: { username: 1 }
						})
						.then((users) => {
							res.status(200).json(new ResponseModel({
								code: 200,
								status_text: 'OK',
								success: true,
								data: { pages: pages, result: users },
								errors: null
							}));
						})
				})
				.catch(error => {
					handlingCannotGetUsers(req, res);
				});
		})
		.catch(error => {
			Handler.invalidAccessToken(req, res);
		});
}

function login(req, res) {
	VerifyUtils
		.verifyPublicRequest(req)
		.then(isAccess => {
			if (!isAccess) {
				handlingInvalidApiKey(res);
				return;
			}
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
					handlingUserNotExists(req, res);
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
				handlingInvalidApiKey(res);
				return;
			}
			let user = req.body;
			User.create(user)
				.then(data => {
					res.status(200).json(new ResponseModel({
						code: 200,
						status_text: 'OK',
						success: true,
						data: getMessage(req, 'please_check_email_to_active_account')
					}));
				})
				.catch(error => {
					// if(error instanceof SequelizeValidationError){
						
					// }
					console.log(error);
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
		success: false,
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
		errors: [getMessage(req, 'user_not_exist')]
	}));
}


function handlingCannotGetUsers(req, res) {
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'can_not_get_users')]
	}));
}
function getMessage(req, errorText){
	let lang = req.query.lang || 'vi';
	return MessageHelper.getMessage(lang, errorText);
}
