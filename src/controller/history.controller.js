const User = require('../model/index').User;
const Property=require('../model/index').Property;
const History=require('../model/index').History;
const ResponseModel = require('../util/response-model');
const VerifyUtils = require('../util/verify-request');
const NumberUtils = require('../util/number-utils');
const MessageHelper = require('../util/message/message-helper');
const Handler = require('./handling-helper');
const IncludeModelProperty=require('../util/include-model');

const HistoryController={};
HistoryController.clearHistory=clearHistory;
module.exports=HistoryController;


async function clearHistory(req,res){
    try {
        let verify = await VerifyUtils.verifyProtectRequest(req);
        let user_id=req.query.user_id;
        let data = await History.destroy({where:{user_id:user_id}});
        responseData(res, MessageHelper.getMessage(req.query.lang || 'vi', "clear_history_success"));
    } catch (error) {
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name == 'ErrorModel') {
            Handler.handlingErrorModel(res, error);
        } else {
           handlingCannotClearHistory(req, res);
        }
    }
}

function responseData(res, data) {
    res.status(200).json(new ResponseModel({
        code: 200,
        status_text: 'OK',
        success: true,
        data: data,
        errors: null
    }));
}

function handlingCannotClearHistory(req,res){
    res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'cannot_clear_history')]
	}));
}
function getMessage(req, errorText) {
	let lang = req.query.lang || 'vi';
	return MessageHelper.getMessage(lang, errorText);
}