<<<<<<< HEAD
const MessageHelper = require('../util/message/message-helper');
=======
 const MessageHelper = require('../util/message/message-helper');
>>>>>>> 225a7758de6c7f2ea535f8096e2838df9f6cc875
const ResponseModel = require('../util/response-model');

const Handler = {};

Handler.unAuthorizedAdminRole = function(req, res) {
	let lang = req.query.lang || 'vi';
	res.status(401).json(new ResponseModel({
		code: 401,
		status_text: 'UNAUTHORIZED',
		success: false,
		data: null,
		errors: [MessageHelper.getMessage(lang, 'need_admin_role')]
	}));
}

Handler.invalidApiKey = function(req, res) {
	let lang = req.query.lang || 'vi';
	res.status(400).json(new ResponseModel({
		code: 400,
		status_text: 'BAD REQUEST',
		success: false,
		data: null,
		errors: [MessageHelper.getMessage(lang, 'invalid_api_key')]
	}));
}

Handler.invalidAccessToken = function(req, res) {
	let lang = req.query.lang || 'vi';
	res.status(401).json(new ResponseModel({
		code: 401,
		status_text: 'UNAUTHORIZED',
		success: false,
		data: null,
		errors: [MessageHelper.getMessage(lang, 'invalid_access_token')]
	}));
}


Handler.cannotConnectDatabase = function(req, res) {
	let lang = req.query.lang || 'vi';
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [MessageHelper.getMessage(lang, 'database_is_down')]
	}));
}
Handler.validateError = function(req, res, error) {
	let lang = req.query.lang || 'vi';

	let listError = [];
	try {
		error.errors.forEach(e => {
			try {
				if (lang == 'en') {
					let code = JSON.parse(e.message).code;
					let errText = MessageHelper.getMessageByCode(lang, code);
					listError.push(errText);
				}
				listError.push(JSON.parse(e.message));
			} catch (err) {
				if (e.message !== null && e.message !== undefined) {
					listError.push({ code: 666, message: e.message });
				} else {
					listError.push(MessageHelper.getMessage(lang, 'unknown_message'));
				}
			}
		});
	} catch (err) {
		listError.push(MessageHelper.getMessage(lang, 'unknown_message'));
	}

	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: listError
	}));
}

module.exports = Handler;