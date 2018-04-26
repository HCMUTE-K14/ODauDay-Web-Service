const Favorite = require('../model/index').Favorite;
const User = require('../model/index').User;

const ResponseModel = require('../util/response-model');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');

const FavoriteController = {};
FavoriteController.create = create;
FavoriteController.remove = remove;
FavoriteController.getByUserId = findFavoriteByUserId;

module.exports = FavoriteController;

async function create(req, res) {
	try {
		let isAccess = await VerifyUtils.verifyProtectRequest(req);
		let userIdFromHeader = isAccess.user.id;
		let body = req.body;

		if (userIdFromHeader !== body.user_id) {
			handlingCannotCreateFavorite(req, res);
			return;
		}

		let created = await Favorite.create(body);

		if (created) {
			res.status(200).json(new ResponseModel({
				code: 200,
				status_text: 'OK',
				success: true,
				data: 'success'
			}));
		} else {
			handlingCannotCreateFavorite(req, res);
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
			handlingCannotCreateFavorite(req, res);
		}
	}
}

async function remove(req, res) {
	try {
		let isAccess = await VerifyUtils.verifyProtectRequest(req);
		let userIdFromHeader = isAccess.user.id;
		let body = req.body;

		if (userIdFromHeader !== body.user_id) {
			handlingCannotDeleteFavorite(req, res);
			return;
		}
		Favorite.destroy({
				where: {
					user_id: body.user_id,
					property_id: body.property_id
				}
			})
			.then(success => {
				if (success > 0) {
					res.status(200).json(new ResponseModel({
						code: 200,
						status_text: 'OK',
						success: true,
						data: 'success'
					}));
				} else {
					handlingCannotDeleteFavorite(req, res);
				}
			})
			.catch(error => {
				handlingCannotDeleteFavorite(req, res);
			})
	} catch (error) {
		if (error.constructor.name === 'ConnectionRefusedError') {
			Handler.cannotConnectDatabase(req, res);
		} else if (error.constructor.name === 'ValidationError' ||
			error.constructor.name === 'UniqueConstraintError') {
			Handler.validateError(req, res, error);
		} else if (error.constructor.name === 'ErrorModel') {
			Handler.invalidAccessToken(req, res);
		} else {
			handlingCannotDeleteFavorite(req, res);
		}
	}
}

async function findFavoriteByUserId(req, res) {
	try {

		let isAccess = await VerifyUtils.verifyProtectRequest(req);
		let userIdFromHeader = isAccess.user.id;
		let userId = req.params.id;

		if (userIdFromHeader !== userId) {
			handlingCannotGetFavorite(req, res);
			return;
		}

		let data = await DB.User.findById(req.params.id, {
			include: [{
				model: DB.Property,
				as: 'favorites',
				attributes: ['id', 'name', 'code', 'latitude', 'longidude', 'postcode', 'status', 'price', 'description', 'num_of_bedroom', 'num_of_bathroom', 'num_of_parking', 'land_size'],
				through: { attributes: [] }
			}]
		})
		if (data) {
			res.status(200).json(new ResponseModel({
				code: 200,
				status_text: 'OK',
				success: true,
				data: data
			}));
		} else {
			handlingCannotGetFavorite(req, res);
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
			handlingCannotGetFavorite(req, res);
		}
	}
}

function handlingCannotCreateFavorite(req, res) {
	res.status(503).json(new ResponseModel({
 		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'create_favorite_fail')]
	}));
}

function handlingCannotGetFavorite(req, res) {
	res.status(503).json(new ResponseModel({
 		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'get_favorite_fail')]
	}));
}

function handlingCannotDeleteFavorite(req, res) {
	res.status(503).json(new ResponseModel({
 		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'delete_favorite_fail')]
	}));
}

function getMessage(req, errorText) {
	let lang = req.query.lang || 'vi';
	return MessageHelper.getMessage(lang, errorText);
}