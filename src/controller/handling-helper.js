const MessageHelper = require('../util/message/message-helper');
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


module.exports = Handler;