const User = require('../model/index').User;
const Property = require('../model/index').Property;
const Favorite = require('../model/index').Favorite;
const ResponseModel = require('../util/response-model');
const VerifyUtils = require('../util/verify-request');
const NumberUtils = require('../util/number-utils');
const MessageHelper = require('../util/message/message-helper');
const Handler = require('./handling-helper');
const IncludeModelProperty = require('../util/include-model');
const ShareFavorite = require("../util/share-favorite/share-favorite-to-email");

const FavoriteController = {};
FavoriteController.getPropertyFavoriteByUser = getPropertyFavoriteByUser;
FavoriteController.checkFavorite = checkFavorite;
FavoriteController.unCheckFavorite = unCheckFavorite;
FavoriteController.unCheckFavorites = unCheckFavorites;
FavoriteController.sharePropertyFavoriteToMail = sharePropertyFavoriteToMail;
module.exports = FavoriteController;

async function getPropertyFavoriteByUser(req, res) {
    try {
        let verify = await VerifyUtils.verifyPublicRequest(req);
        let query = { id: req.query.id };
        let data = await User.findOne({
            where: query,
            include: [{
                model: Property,
                as: 'favorites',
                include: IncludeModelProperty.getModelProperty(),
                where: {status: 'active'},
                attributes: {
                    exclude: ['user_id_checked', 'date_modified', 'user_id_created'],
                },
                through: { attributes: ["date_created"] }
            }],
            attributes: ['id']
        });
        responseData(res, data);
    } catch (error) {
        console.log("lang thang:" + error);
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name == 'ErrorModel') {
            Handler.handlingErrorModel(res, error);
        } else {
            handlingCanotGetPropertyFavoriteByUser(req, res);
        }
    }
}

async function checkFavorite(req, res) {
    try {
        let verify = await VerifyUtils.verifyProtectRequest(req);
        let favorite = req.body;
        let data = await Favorite.create(favorite);
        responseData(res, MessageHelper.getMessage(req.query.lang || 'vi', "check_favorite_success"));
    } catch (error) {
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name == 'ErrorModel') {
            Handler.handlingErrorModel(res, error);
        } else {
            handlingCannotCheckFavorite(req, res);
        }
    }
}
async function unCheckFavorite(req, res) {
    try {
        let verify = await VerifyUtils.verifyProtectRequest(req);
        let property_id = req.query.property_id;
        let data = await Favorite.destroy({
            where: {
                property_id: property_id,
                user_id: verify.user.id
            }
        });

        responseData(res, MessageHelper.getMessage(req.query.lang || 'vi', "uncheck_favorite_success"));
    } catch (error) {
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name == 'ErrorModel') {
            Handler.handlingErrorModel(res, error);
        } else {
            handlingCannotUnCheckFavorite(req, res);
        }
    }
}
async function unCheckFavorites(req, res) {
    try {
        let verify = await VerifyUtils.verifyProtectRequest(req);
        let properties_id = getPropertiesId(req);
        let users_id = getUserId(req);
        let data = await Favorite.destroy({ where: { property_id: properties_id, user_id: users_id } });
        responseData(res, MessageHelper.getMessage(req.query.lang || 'vi', "uncheck_favorite_success"));
    } catch (error) {
        console.log("lang thang: " + error);
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name == 'ErrorModel') {
            Handler.handlingErrorModel(res, error);
        } else {
            handlingCannotUnCheckFavorite(req, res);
        }
    }
}
async function sharePropertyFavoriteToMail(req, res) {
    try {
        let verify = await VerifyUtils.verifyProtectRequest(req);
        let data = req.body;
        console.log("data: " + data);
        let result = await ShareFavorite.sendMailShareProprety(data);
        responseData(res, MessageHelper.getMessage(req.query.lang || 'vi', "share_favorite_success"));
    } catch (error) {
        console.log("lang thang:" + error)
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name == 'ErrorModel') {
            Handler.handlingErrorModel(res, error);
        } else {
            handlingCannotShareProperties(req, res);
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

function getPropertiesId(req) {
    let result = [];
    let properties = req.body;
    properties.forEach(function(item) {
        result.push(item.property_id);
    });
    return result;
}

function getUserId(req) {
    let result = [];
    let properties = req.body;
    properties.forEach(function(item) {
        result.push(item.user_id);
    });
    return result;
}

function handlingCannotShareProperties(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'cannot_share_property_favorite')]
    }));
}

function handlingCanotGetPropertyFavoriteByUser(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'cannot_get_property_favorite_by_user')]
    }));
}

function handlingCannotCheckFavorite(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'cannot_check_favorite')]
    }));
}

function handlingCannotUnCheckFavorite(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'cannot_uncheck_favorite')]
    }));
}

function getMessage(req, errorText) {
    let lang = req.query.lang || 'vi';
    return MessageHelper.getMessage(lang, errorText);
}