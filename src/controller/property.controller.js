const Property = require("../model/index").Property;
const Tag = require("../model/index").Tag;
const Category = require("../model/index").Category;
const Email = require("../model/index").Email;
const Phone = require("../model/index").Phone;
const Image = require("../model/index").Image;
const PropertyTag = require("../model/index").PropertyTag;
const PropertyCategory = require("../model/index").PropertyCategory;

const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');

const IncludeModeProperty=require('../util/include-model');

const PropertyController = {};

PropertyController.getAll = getAll;
PropertyController.getPropertyByUser = getPropertyByUser;
PropertyController.create = create;
PropertyController.destroy = destroy;
PropertyController.changeStatus=changeStatus;

module.exports = PropertyController;


async function create(req, res) {
	try {
		//let verify = await VerifyUtils.verifyProtectRequest(req);
		let body = req.body;
		let property;
		property = body;

		property.latitude = body.location.latitude;
		property.longitude = body.location.longitude;
		property.date_end = new Date((new Date()).getTime() 
			+ 24 * 60 * 60 * 1000 * 30);

		let data = await Property.create(property, {
			include: [{
					model: Email,
					as: 'emails',
					attributes: ['id', 'email']
				},
				{
					model: Phone,
					as: 'phones',
					attributes: ['id', 'phone_number']
				},
				{
					model: Image,
					as: 'images',
					attributes: ['id', 'url']
				}
			]
		});

		//tag, category
		let property_tags = getPropertyTagFromBody(req.body.tags, data.id);
		let result_property_tag = await PropertyTag.bulkCreate(property_tags);

		let property_categories = getPropertyCategoryFromBody(req.body.categories, data.id);
		let result_property_categories = await PropertyCategory.bulkCreate(property_categories);

		responseData(res, MessageHelper.getMessage(req.query.lang || 'vi', "create_property_success"));
	} catch (error) {
		console.log(error);
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

function getPropertyTagFromBody(property_tags, property_id) {
	let result = [];
	property_tags.forEach(function(item) {
		result.push({
			property_id: property_id,
			tag_id: item.id
		});
	});
	return result;
}

function getPropertyCategoryFromBody(property_categories, property_id) {
    let result = [];
    property_categories.forEach(function (item) {
        result.push({
            property_id: property_id,
            category_id: item
        });
    });
    return result;
}
async function getAll(req, res) {
    try {
        let verify = await VerifyUtils.verifyPublicRequest(req);

        let data = await Property.findAll({
            include: IncludeModeProperty.getModelProperty()
        });

        responseData(res, data);
    } catch (error) {
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

async function getPropertyByUser(req, res) {
    try {
        //let verify = await VerifyUtils.verifyProtectRequest(req);
        let user_id = req.query.user_id;
        let data = await Property.findAll({
            include: IncludeModeProperty.getModelProperty(), where: { user_id_created: user_id }
        });

        responseData(res, data);

    } catch (error) {
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name == 'ErrorModel') {
            Handler.handlingErrorModel(res, error);
        } else {
            handlingCanotGetPropertyByUser(req, res);
        }
    }
}
async function changeStatus(req,res){
	try {
		let verify = await VerifyUtils.verifyProtectRequest(req);
		
		let property_id = req.query.id;
		let status=req.query.status;
		let data = await Property.update({status:status}, { where: { id: property_id } })
		
        responseData(res, MessageHelper.getMessage(req.query.lang || 'vi', "change_status_success"));
    } catch (error) {
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name == 'ErrorModel') {
            Handler.handlingErrorModel(res, error);
        } else {
            handlingCannotChangeStatusProperty(req, res);
        }
    }
}

async function destroy(req, res) {
    try {
        let verify = await VerifyUtils.verifyProtectRequest(req);
        let property_id = req.query.id;
        let data=await Property.destroy({include:IncludeModeProperty.getModelProperty(), where:{id:property_id}});        
        responseData(res, MessageHelper.getMessage(req.query.lang || 'vi', "destroy_property_success"));
    } catch (error) {
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

function responseData(res, data) {
	res.status(200).json(new ResponseModel({
		code: 200,
		status_text: 'OK',
		success: true,
		data: data,
		errors: null
	}));
}

function handlingCanotGetAllProperty(req, res) {
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'can_not_get_property')]
	}));
}

function handlingCannotCreateProperty(req, res) {
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'can_not_create_property')]
	}));
}

function handlingCannotUpdateProperty(req, res) {
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'can_not_update_property')]
	}));
}

function handlingCannotDestroyProperty(req, res) {
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'can_not_destroy_property')]
	}))
}

function handlingCanotGetPropertyByUser(req, res) {
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'can_not_get_property_by_user')]
	}))
}
function handlingCannotChangeStatusProperty(req,res){
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'can_not_change_status')]
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