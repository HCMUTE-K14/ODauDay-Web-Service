const Note = require('../model/index').Note;
const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');

const NoteController = {};
NoteController.create = create;
NoteController.update = update;
NoteController.remove = remove;

module.exports = NoteController;

async function create(req, res) {
	try {
		let verify = await VerifyUtils.verifyProtectRequest(req);
		let note = req.body;

		let result = await Note.create(note);

		res.status(200).json(new ResponseModel({
			code: 200,
			status_text: 'OK',
			success: true,
			data: getMessage(req, 'create_note_successful'),
			errors: null
		}))
	} catch (error) {
		if (error.constructor.name === 'ConnectionRefusedError') {
			Handler.cannotConnectDatabase(req, res);
		} else if (error.constructor.name === 'ValidationError' ||
			error.constructor.name === 'UniqueConstraintError') {
			Handler.validateError(req, res, error);
		} else if (error.constructor.name == 'ErrorModel') {
			Handler.handlingErrorModel(res, error);
		} else {
			res.status(503).json(new ResponseModel({
				code: 503,
				status_text: 'SERVICE UNAVAILABLE',
				success: false,
				data: null,
				errors: [getMessage(req, 'create_note_failure')]
			}))
		}
	}
}

async function update(req, res) {
	try {
		let verify = await VerifyUtils.verifyProtectRequest(req);
		let note = req.body;

		let result = await Note.update(note, {where: {
			user_id: verify.user.id,
			property_id: note.property_id
		}});

		res.status(200).json(new ResponseModel({
			code: 200,
			status_text: 'OK',
			success: true,
			data: getMessage(req, 'update_note_successful'),
			errors: null
		}))
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
			res.status(503).json(new ResponseModel({
				code: 503,
				status_text: 'SERVICE UNAVAILABLE',
				success: false,
				data: null,
				errors: [getMessage(req, 'update_note_failure')]
			}))
		}
	}
}

async function remove(req, res) {
	try {
		let verify = await VerifyUtils.verifyProtectRequest(req);
		let note = req.body;

		let result = await Note.destroy({where: {
			user_id: verify.user.id,
			property_id: note.property_id
		}});

		res.status(200).json(new ResponseModel({
			code: 200,
			status_text: 'OK',
			success: true,
			data: getMessage(req, 'delete_note_successful'),
			errors: null
		}))
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
			res.status(503).json(new ResponseModel({
				code: 503,
				status_text: 'SERVICE UNAVAILABLE',
				success: false,
				data: null,
				errors: [getMessage(req, 'delete_note_failure')]
			}))
		}
	}
}


function getMessage(req, errorText) {
	return MessageHelper.getMessage(req.query.lang || 'vi', errorText);
}