const Property = require("../model/index").Property;
const Tag=require("../model/index").Tag;
const Category=require("../model/index").Category;
const Feature=require("../model/index").Feature;
const Type=require("../model/index").Type;
const Email=require("../model/index").Email;
const Phone=require("../model/index").Phone;
const Image=require("../model/index").Image;
const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');
const EmailController=require("./email.controller");
const PropertyController={};

PropertyController.getAll=getAll;
PropertyController.create=create;
PropertyController.update=update;
PropertyController.destroy=destroy;

module.exports=PropertyController;

async function getAll(req,res){
    try{
        let verify=await VerifyUtils.verifyPublicRequest(req);

        let data=await Property.findAll({
            include: [
                { 
                    model: Feature,
                    attributes:['id','name']
                },
                { 
                    model: Tag,
                    as: 'tags',
                    attributes: {
                        exclude: ['PropertyTag']
                    },
                    through: { attributes: [] }
                },
                {
                    model: Category,
                    as: 'categorys',
                    attributes: {
                        exclude: ['PropertyCategory']
                    },
                    through: { attributes: [] }
                },
                {
                    model: Type,
                    as: 'types',
                    attributes: {
                        exclude: ['PropertyType']
                    },
                    through: { attributes: [] }
                },
                { 
                    model: Email,
                    attributes:['id','name','email']
                },
                { 
                    model: Phone,
                    attributes:['id','name','phone_number']
                },
                {
                    model: Image,
                    attributes: ['id','url']
                }
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
			handlingCanotGetAllProperty(req, res);
		}
    }
}

async function create(req,res){
    try{
        let verify=await  VerifyUtils.verifyProtectRequest(req);
        let property = req.body;
        let data= await Property.create(property,{
            include: [
				{ model: Tag, as: 'tags' }
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
			handlingCannotCreateProperty(req, res);
		}
    }
}
async function update(req,res){
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);
        let property = req.body;
        let property_id = req.body.id;
        let data =await Property.update(property, { where: { id: property_id } });
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
			handlingCannotUpdateProperty(req, res);
		} 
    }
   
}
async function destroy(req,res){
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);
        let property_id=req.query.id;
        let data=await Property.destroy({where: { id: property_id }})
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
			handlingCannotDestroyProperty(req, res);
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
function handlingCanotGetAllProperty(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_get_property')]
    }));
}
function handlingCannotCreateProperty(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_create_property')]
    }));
}
function handlingCannotUpdateProperty(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_update_property')]
    }));
}
function handlingCannotDestroyProperty(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_destroy_property')]
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