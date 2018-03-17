const Image = require("../model/index").Image;
const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');

const ImageController = {};

ImageController.getImageByProperty=getImageByProperty;
ImageController.create = create;
ImageController.update = update;
ImageController.destroy = destroy;

module.exports = ImageController;



async function getImageByProperty(req,res){
    try{
        let verify=await VerifyUtils.verifyPublicRequest(req);

        let property_id=req.query.property_id;
        let data=await Image.findAll({
            where: { property_id: property_id },
            attributes:['id', 'url']
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
			handlingCannotGetImageByProperty(req, res);
		}
    }
}

async function create(req, res) {
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);

        let image = req.body;
        let data = await Image.create(image);
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
			handlingCannotCreateImage(req, res);
		}
    }
}
async function update(req, res) {
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);
        let image = req.body;
        let image_id = req.body.id;
        let data = await Image.update(image, { where: { id: image_id } })
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
			handlingCannotUpdateImage(req, res);
		}
    }
}

async function destroy(req, res) {
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);

        let image_id = req.query.id;
        let data = await Image.destroy({
            where: { id: image_id }
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
			handlingCannotDestroyImage(req, res);
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
function handlingCannotCreateImage(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_create_image')]
    }));
}
function handlingCannotUpdateImage(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_update_image')]
    }));
}
function handlingCannotDestroyImage(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_delete_image')]
    }));
}
function handlingCannotGetImageByProperty(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_get_image_by_property')]
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
function getMessage(req, errorMessage) {
    return MessageHelper.getMessage(req.query.lang || 'vi', errorMessage);
}