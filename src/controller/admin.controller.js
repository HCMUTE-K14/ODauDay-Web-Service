const User = require('../model/index').User;

const ResponseModel = require('../util/response-model');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');
const Handler = require('./handling-helper');

const AdminController = {};
AdminController.getUsers = getUsers;

module.exports = AdminController;

function getUsers(req, res) {
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

function handlingCannotGetUsers(req, res) {
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'can_not_get_users')]
	}));
}

function getMessage(req, errorText) {
	let lang = req.query.lang || 'vi';
	return MessageHelper.getMessage(lang, errorText);
}