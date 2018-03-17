const Email = require("../model/index").Email;
const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');

const EmailController = {};

EmailController.getEmailByProperty = getEmailByProperty;
EmailController.create = create;
EmailController.update = update;
EmailController.destroy = destroy;

module.exports = EmailController;

async function getEmailByProperty(req,res) {
    try{
        let verify=await VerifyUtils.verifyPublicRequest(req);
        let property_id=req.query.property_id;
        let data=await Email.findAll({
            where: { property_id: property_id }
        });

        responseData(res,data);

    }catch(error){
        if (error.constructor.name === 'ConnectionRefusedError') {
			Handler.cannotConnectDatabase(req, res);
		} else if (error.constructor.name === 'ValidationError' ||
			error.constructor.name === 'UniqueConstraintError') {
			Handler.validateError(req, res, error);
		} else if (error.constructor.name == 'ErrorModel') {
			Handler.handlingErrorModel(res, error);
		} else {
			handlingCanotGetEmailByProperty(req, res);
		}
    }
}
async function create(req,res) {
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);

        let email = req.body;
        let data = await Email.create(email);
        responseData(res,data);

    }catch(error){
        if (error.constructor.name === 'ConnectionRefusedError') {
			Handler.cannotConnectDatabase(req, res);
		} else if (error.constructor.name === 'ValidationError' ||
			error.constructor.name === 'UniqueConstraintError') {
			Handler.validateError(req, res, error);
		} else if (error.constructor.name == 'ErrorModel') {
			Handler.handlingErrorModel(res, error);
		} else {
			handlingCannotCreateEmail(req, res);
		}
    }
}
async function update(req, res) {
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);
        let email = req.body;
        let email_id = req.body.id;
        let data = await Email.update(email, { where: { id: email_id } })
        if(data){
            responseData(res,data);
        }
        
    }catch(error){
        if (error.constructor.name === 'ConnectionRefusedError') {
			Handler.cannotConnectDatabase(req, res);
		} else if (error.constructor.name === 'ValidationError' ||
			error.constructor.name === 'UniqueConstraintError') {
			Handler.validateError(req, res, error);
		} else if (error.constructor.name == 'ErrorModel') {
			Handler.handlingErrorModel(res, error);
		} else {
			handlingCannotUpdateCategory(req, res);
		}
    }
}
async function destroy(req, res) {
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);

        let email_id = req.query.id;
        let data = await Email.destroy({
            where: { id: email_id }
        })
        if(data){
            responseData(res,data);
        }
        
    }catch(error){
        if (error.constructor.name === 'ConnectionRefusedError') {
			Handler.cannotConnectDatabase(req, res);
		} else if (error.constructor.name === 'ValidationError' ||
			error.constructor.name === 'UniqueConstraintError') {
			Handler.validateError(req, res, error);
		} else if (error.constructor.name == 'ErrorModel') {
			Handler.handlingErrorModel(res, error);
		} else {
			handlingCannotDestroyCategory(req, res);
		}
    }
}
function responseData(res,data){
    res.status(200).json(new ResponseModel({
        code: 200,
        status_text: 'OK',
        success: true,
        data: data,
        errors: null
    }));
}
function handlingCanotGetEmailByProperty(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_get_email_by_property')]
    }));
}
function handlingCannotCreateEmail(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_create_email')]
    }));
}
function handlingCannotUpdateEmail(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_update_email')]
    }));
}
function handlingCannotDestroyEmail(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_destroy_email')]
    }))
}
function errorVerifyApiKey(req, res) {
    res.status(505).json(new ResponseModel({
        code: 505,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'invalid_api_key')]
    }));
}
function getMessage(req, errorText) {
    return MessageHelper.getMessage(req.query.lang || 'vi', errorText);
}