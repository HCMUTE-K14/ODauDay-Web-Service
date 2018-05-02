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

const PropertyController = {};
PropertyController.create = create;


module.exports = PropertyController;

async function create(req, res) {
	try {
		//let verify = await VerifyUtils.verifyProtectRequest(req);
		let body = req.body;

		let property;

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

		let property_categories = getPropertyCategory(req.body.categorys, data.id);
		let result_property_categories = await PropertyCategory.bulkCreate(property_categories);

		responseData(res, MessageHelper.getMessage(req.query.lang || 'vi', "create_property_success"));
	} catch (error) {
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

function responseData(res, data) {
    res.status(200).json(new ResponseModel({
        code: 200,
        status_text: 'OK',
        success: true,
        data: data,
        errors: null
    }));
}

function getPropertyTagFromBody(property_tags, property_id) {
    let result = [];
    property_tags.forEach(function (item) {
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
// { address: '19784 Võ Văn Ngân, Linh Chiểu, Thủ Đức, Hồ Chí Minh, Vietnam',
//   categories: [ '2', '4' ],
//   code: '428b#10058',
//   description: '1231232131',
//   emails:
//    [ { email: 'daohuuloc9419@gmail.com',
//        id: '2dc57a10-aa8f-4a61-9ac5-606ebda36e06' } ],
//   id: '2428ba48-3463-46a2-a1cd-306b65ceedcb',
//   images:
//    [ { id: '42033006-87dc-4cfa-a1e3-61acc34230f9',
//        url: 'image/1525238967113_f.jpg' },
//      { id: '64083cf7-6a45-44e1-b7e5-ba7c74e57803',
//        url: 'image/1525238967113_f_cry.jpg' } ],
//   location: { latitude: 10.851458803156863, longitude: 106.77012495696546 },
//   num_of_bathroom: 1,
//   num_of_bedroom: 1,
//   num_of_parking: 1,
//   phones:
//    [ { id: '7f12c1ef-d0c4-4b6c-8ea2-960335900f7e',
//        phone_number: '321321312' } ],
//   postcode: 0,
//   price: 12312311321,
//   size: 10000,
//   status: 'pending',
//   tags:
//    [ { id: '17', name: 'Gas' },
//      { id: '9', name: 'Double glazed windows' },
//      { id: '16', name: 'Garden / Courtyard' } ],
//   type_id: 'BUY',
//   user_id_created: '' }