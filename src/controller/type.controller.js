const Type = require("../model/index").Type;
const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');

const TypeController={};

TypeController.getAll=getAll;
TypeController.create=create;
TypeController.update=update;
TypeController.destroy=destroy;

module.exports=TypeController;

async function getAll(req,res){
    try{
        let verify=await VerifyUtils.verifyPublicRequest(req);
        let data=await Type.findAll({order: [
                    ['name', 'ASC']
                ]
        });

        responseData(res,data);

    }catch(error){
        console.log(error);
        if (error.constructor.name === 'ConnectionRefusedError') {
			Handler.cannotConnectDatabase(req, res);
		} else if (error.constructor.name === 'ValidationError' ||
			error.constructor.name === 'UniqueConstraintError') {
			Handler.validateError(req, res, error);
		} else if (error.constructor.name == 'ErrorModel') {
			Handler.handlingErrorModel(res, error);
		} else {
			handlingCanotGetAllType(req, res);
		}
    }
}

async function create(req,res){
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);
        if (verify.user.role != 'admin') {
            Handler.unAuthorizedAdminRole(req, res);
            return;
        }
        let type = req.body;
        let data = await Type.create(type);
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
			handlingCannotCreateType(req, res);
		}
    }
}
async function update(req,res){
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);
        if (verify.user.role != 'admin') {
            Handler.unAuthorizedAdminRole(req, res);
            return;
        }
        let type = req.body;
        let type_id = req.body.id;
        let data = await Type.update(type, { where: { id: type_id } })
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
			handlingCannotUpdateType(req, res);
		}
    }
}
async function destroy(req,res){
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);
        if (verify.user.role != 'admin') {
            Handler.unAuthorizedAdminRole(req, res);
            return;
        }
        let type_id = req.query.id;
        let data = await Type.destroy({
            where: { id: type_id }
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
			handlingCannotDestroyTag(req, res);
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
function handlingCanotGetAllType(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_get_type')]
    }));
}
function handlingCannotCreateType(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_create_type')]
    }));
}
function handlingCannotUpdateType(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_update_type')]
    }));
}
function handlingCannotDestroyType(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_destroy_type')]
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