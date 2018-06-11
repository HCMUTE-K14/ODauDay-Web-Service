const Database = require('../model/index');
const Image = require('../model/index').Image;
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');
const ResponseModel = require('../util/response-model');


const SimilarPropertyController = {};
SimilarPropertyController.get = get;

module.exports = SimilarPropertyController;

async function get(req, res) {
    try {
        let verify = await VerifyUtils.verifyProtectRequest(req);
        let userIdFromHeader = verify.user.id;
        let propertyId = req.params.id;
        Database
            .sequelize
            .query('CALL similar_property($propertyId, $userId)', {
                bind: {
                    propertyId: propertyId,
                    userId: userIdFromHeader
                }
            })
            .then(properties => {
                loadImageForProperties(propertyId, properties)
                    .then(result => {
                        res.status(200).json(new ResponseModel({
                            code: 200,
                            status_text: 'OK',
                            success: true,
                            data: result,
                            errors: null
                        }));
                    })
            })
    } catch (error) {
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name === 'ErrorModel') {
            Handler.invalidAccessToken(req, res);
        } else {
            res.status(503).json(new ResponseModel({
                code: 503,
                status_text: 'SERVICE UNAVAILABLE',
                success: false,
                data: null,
                errors: [getMessage(req, 'unknown_message')]
            }));
        }

    }
}

function getMessage(req, errorText) {
    let lang = req.query.lang || 'vi';
    return MessageHelper.getMessage(lang, errorText);
}

function loadImageForProperties(propertyId, properties) {
    return new Promise((resolve, reject) => {
        let result = [];
        let size = properties.length;
        if (size == 0) {
            resolve(result);
        }
        if (size == 1 && propertyId == properties[0].id) {
            resolve(result);
        }
        for (let i = 0; i < size; i++) {
            if (properties[i].id != propertyId) {
            	properties[i].isFavorited = properties[i].isFavorited > 0;
                loadImageForProperty(properties[i])
                    .then(data => {
                        result.push(data);
                        if (i == size - 1) {
                            resolve(result);
                        }
                    })
            }
        }
    })
}

function loadImageForProperty(item) {
    return new Promise((resolve, reject) => {
        Image.findOne({
                where: { property_id: item.id },
                attributes: {
                    exclude: ['id', 'property_id', 'date_created', 'updatedAt']
                }
            })
            .then(images => {
                if (images) {
                    item.image = images;
                }
                resolve(item);
            })
            .catch(error => {
                resolve(item);
            })
    })
}