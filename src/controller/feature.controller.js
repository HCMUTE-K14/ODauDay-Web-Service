const Feature = require("../model/index").Feature;
const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');

const FeatureController = {};

FeatureController.getFeatureByProperty=getFeatureByProperty;
FeatureController.create = create;
FeatureController.update = update;
FeatureController.destroy = destroy;

module.exports = FeatureController;


async function getFeatureByProperty(req,res){
    try{
        let verify=await VerifyUtils.verifyPublicRequest(req);
        let property_id=req.query.property_id;
        let data=await Feature.findAll({
            where: { property_id: property_id },
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
			handlingCanotGetFeatureByProperty(req, res);
		}
    }
}

async function create(req, res) {
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);

        let feature = req.body;
        let data = await Feature.create(feature);
        responseData(res, data);

    }catch(error){
        if (error.constructor.name === 'ConnectionRefusedError') {
			Handler.cannotConnectDatabase(req, res);
		} else if (error.constructor.name === 'ValidationError' ||
			error.constructor.name === 'UniqueConstraintError') {
			Handler.validateError(req, res, error);
		} else if (error.constructor.name == 'ErrorModel') {
			Handler.handlingErrorModel(res, error);
		} else {
			handlingCannotCreateFeature(req, res);
		}
    }
}
async function update(req, res) {
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);
        let feature = req.body;
        let feature_id = req.body.id;
        let data = await Feature.update(feature, { where: { id: feature_id } })
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
			handlingCannotUpdateFeature(req, res);
		}
    }
}

async function destroy(req, res) {
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);

        let feature_id = req.query.id;
        let data = await Feature.destroy({
            where: { id: feature_id }
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
			handlingCannotDestroyFeature(req, res);
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
function handlingCannotCreateFeature(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_create_feature')]
    }));
}
function handlingCannotUpdateFeature(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_update_feature')]
    }));
}
function handlingCannotDestroyFeature(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_delete_feature')]
    }));
}
function handlingCanotGetFeatureByProperty(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_get_feature_by_property')]
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