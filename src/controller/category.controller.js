const Category = require("../model/index").Category;
const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');

const CategoryController={};

CategoryController.getAll=getAll;
CategoryController.create=create;
CategoryController.update=update;
CategoryController.destroy=destroy;

module.exports=CategoryController;


async function getAll(req,res){
    try{
        let verify=await VerifyUtils.verifyPublicRequest(req);
        
        let data=await Category.findAll({
            order: [
                ['name', 'ASC']
            ]
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
			handlingCanotGetAllCategory(req, res);
		}
    }
    
}
async function create(req,res){
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);
        if(verify.user.role!="admin"){
            Handler.unAuthorizedAdminRole(req, res);
            return;
        }
        let category = req.body;
        let data = await Category.create(category);
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
			handlingCannotCreateCategory(req, res);
		}
    }
}
async function update(req,res){
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);
        if(verify.user.role!="admin"){
            Handler.unAuthorizedAdminRole(req, res);
            return;
        }

        let category = req.body;
        let category_id = req.body.id;
        let data = await Category.update(category, { where: { id: category_id } })
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
async function destroy(req,res){
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);
        if(verify.user.role!="admin"){
            Handler.unAuthorizedAdminRole(req, res);
            return;
        }
        let category_id = req.query.id;
        let data = await Category.destroy({
            where: { id: category_id }
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
function handlingCanotGetAllCategory(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_get_category')]
    }));
}
function handlingCannotCreateCategory(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_create_category')]
    }));
}
function handlingCannotUpdateCategory(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_update_category')]
    }));
}
function handlingCannotDestroyCategory(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_destroy_category')]
    }));
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

function getMessage(req,errorText){
    return MessageHelper.getMessage(req.query.lang||'vi',errorText);
}