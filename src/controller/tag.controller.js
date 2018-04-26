const Tag = require("../model/index").Tag;
const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');

const TagController={};

TagController.getAll=getAll;
TagController.create=create;
TagController.update=update;
TagController.destroy=destroy;

module.exports=TagController;

async function getAll(req,res){
     try{
        let verify=await VerifyUtils.verifyPublicRequest(req);
        let data=await Tag.findAll({order: [
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
			handlingCanotGetAllTag(req, res);
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
        let tag = req.body;
        let data = await Tag.create(tag);
        responseData(res, MessageHelper.getMessage(req.query.lang || 'vi', "create_tag_success"));

    }catch(error){
        if (error.constructor.name === 'ConnectionRefusedError') {
			Handler.cannotConnectDatabase(req, res);
		} else if (error.constructor.name === 'ValidationError' ||
			error.constructor.name === 'UniqueConstraintError') {
			Handler.validateError(req, res, error);
		} else if (error.constructor.name == 'ErrorModel') {
			Handler.handlingErrorModel(res, error);
		} else {
			handlingCannotUpdateTag(req, res);
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
        let tag = req.body;
        let tag_id = req.body.id;
        let data = await Tag.update(tag, { where: { id: tag_id } })
        responseData(res, MessageHelper.getMessage(req.query.lang || 'vi', "update_tag_success"));

    }catch(error){
        if (error.constructor.name === 'ConnectionRefusedError') {
			Handler.cannotConnectDatabase(req, res);
		} else if (error.constructor.name === 'ValidationError' ||
			error.constructor.name === 'UniqueConstraintError') {
			Handler.validateError(req, res, error);
		} else if (error.constructor.name == 'ErrorModel') {
			Handler.handlingErrorModel(res, error);
		} else {
			handlingCannotUpdateTag(req, res);
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
        let tag_id = req.query.id;
        let data = await Tag.destroy({
            where: { id: tag_id }
        })
        responseData(res, MessageHelper.getMessage(req.query.lang || 'vi', "destroy_tag_success"));
        
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
function handlingCanotGetAllTag(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_get_tag')]
    }));
}
function handlingCannotCreateTag(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_create_tag')]
    }));
}
function handlingCannotUpdateTag(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_update_tag')]
    }));
}
function handlingCannotDestroyTag(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_destroy_tag')]
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