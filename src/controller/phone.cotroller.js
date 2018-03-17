const Phone = require("../model/index").Phone;
const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');

const PhoneController={};

PhoneController.getPhoneByProperty=getPhoneByProperty;
PhoneController.create=create;
PhoneController.update=update;
PhoneController.destroy=destroy;

module.exports=PhoneController;

async function getPhoneByProperty(req,res){
    try{
        let verify=await VerifyUtils.verifyPublicRequest(req);

        let property_id=req.query.property_id;
        let data=await Phone.findAll({
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
			handlingCanotGetPhoneByProperty(req, res);
		}
    }
}

async function create(req,res){
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);

        let phone = req.body;
        let data = await Phone.create(phone);
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
			handlingCannotCreatePhone(req, res);
		}
    }
}
async function update(req,res){
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);
        let phone = req.body;
        let phone_id = req.body.id;
        let data = await Phone.update(phone, { where: { id: phone_id } })
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
			handlingCannotUpdatePhone(req, res);
		}
    }
}
async function destroy(req,res){
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);

        let phone_id = req.query.id;
        let data = await Phone.destroy({
            where: { id: phone_id }
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
			handlingCannotDestroyPhone(req, res);
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
function handlingCanotGetPhoneByProperty(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_get_phone_by_property')]
    }));
}
function handlingCannotCreatePhone(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_create_phone')]
    }));
}
function handlingCannotUpdatePhone(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_update_phone')]
    }));
}
function handlingCannotDestroyPhone(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_destroy_phone')]
    }))
}
function errorVerifyApiKey(req,res){
    res.status(505).json(new ResponseModel({
        code: 505,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'invalid_api_key')]
    }));
}
function  getMessage(req,errorText){
    return MessageHelper.getMessage(req.query.lang||'vi',errorText);
}