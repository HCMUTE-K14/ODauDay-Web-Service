const User = require('../model/index').User;
const Property=require('../model/index').Property;

const ResponseModel = require('../util/response-model');
const VerifyUtils = require('../util/verify-request');
const NumberUtils = require('../util/number-utils');
const MessageHelper = require('../util/message/message-helper');
const Handler = require('./handling-helper');

const UserController = {};
UserController.changeProfile = changeProfile;
UserController.changePassword = changePassword;
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

		let updated = await User.update(user, { where: query });

		if (updated) {
			res.status(200).json(new ResponseModel({
				code: 200,
				status_text: 'OK',
				success: true,
				data: getMessage(req, 'update_user_successful')
			}));
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

			let updated = await userExists.update(update, { where: query });

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

function getMessage(req, errorText) {
	let lang = req.query.lang || 'vi';
	return MessageHelper.getMessage(lang, errorText);
}
