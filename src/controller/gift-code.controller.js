const User = require('../model').User;
const GiftCode = require('../model').GiftCode;

const ResponseModel = require('../util/response-model');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');

const Handler = require('./handling-helper');

function useCode(req, res) {
	try {
		let isAccess = await VerifyUtils.verifyProtectRequest(req);
		let body = req.body; // code:,...

		let isExistCode = await GiftCode.findOne({
			where: {
				code: body.code
			}
		});

		if (isCanUseCode(code)) {
			let userId = isAccess.user.id;
			let query = { id: userId };
			let user = User.findOne({ where: query }, {
				attributes: {
					include: ['id', 'amount']
				}
			});
			user.update({ amount: user.amount + code.value })
				.then(isSuccess => {
					await code.update({ num_of_active: code.num_of_active - 1 });
					res.status(200).json(new ResponseModel({
						code: 200,
						status_text: 'OK',
						success: true,
						data: {
							message: 'Account has been updated'
							amount: isSuccess.amount;
						}
					}));
				})
		} else {

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

function handlingCannotUseGiftCode(req, res) {
	res.status(503).json(new ResponseModel({
 		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'sent_mail_fail')]
	}));
}

function isCanUseCode(code) {
	let timeStampEnd = new Date(code.date_end).getTime();
	let currentTimeStamp = new Date().getTime();

	return code.status === = 'active' && currentTimeStamp < timeStampEnd && code.num_of_active > 0;
}

function create(req, res) {

}

function disableCode(req, res) {

}


function update(req, res) {

}

function delete(req, res) {

}

function getMessage(req, errorText) {
	let lang = req.query.lang || 'vi';
	return MessageHelper.getMessage(lang, errorText);
}