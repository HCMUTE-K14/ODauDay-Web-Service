const Feature = require("../model/index").Feature;
const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');

const FeatureController = {};

FeatureController.create = create;
FeatureController.update = update;
FeatureController.destroy = destroy;

module.exports = FeatureController;


function create(req, res) {
    VerifyUtils
        .verifyProtectRequest(req)
        .then(data => {
            if (data.user.role != 'admin') {
                Handler.unAuthorizedAdminRole(req, res);
                return;
            }
            let feature = req.body;
            Feature.create(feature)
                .then(data => {
                    res.status(200).json(new ResponseModel({
                        code: 200,
                        status_text: 'OK',
                        success: true,
                        data: data,
                        errors: null
                    }));
                })
                .catch(error => {
                    handlingCannotCreateFeature(req, res);
                })
        })
        .catch(error => {
            Handler.invalidAccessToken(req, res);
        });
}
function update(req, res) {
    VerifyUtils
        .verifyProtectRequest(req)
        .then(data => {
            if (data.user.role != 'admin') {
                Handler.unAuthorizedAdminRole(req, res);
                return;
            }
            let feature = req.body;
            let feature_id = req.body.id;
            Feature.update(feature, { where: { id: feature_id } })
                .then(data => {
                    res.status(200).json(new ResponseModel({
                        code: 200,
                        status_text: 'OK',
                        success: true,
                        data: data,
                        errors: null
                    }));
                })
                .catch(error => {
                    handlingCannotUpdateFeature(req, res);
                });

        })
        .catch(error => {
            Handler.invalidAccessToken(req, res);
        });
}

function destroy(req, res) {
    VerifyUtils
        .verifyProtectRequest(req)
        .then(data => {
            if (data.user.role != 'admin') {
                Handler.unAuthorizedAdminRole(req, res);
                return;
            }
            console.log("lang thang khong nha");
            let feature_id = req.query.id;
            Feature.destroy({
                where: { id: feature_id }
            })
                .then(data => {
                    res.status(200).json(new ResponseModel({
                        code: 200,
                        status_text: 'OK',
                        success: true,
                        data: data,
                        errors: null
                    }));
                })
                .catch(error => {
                    handingCannotDestroyFeature(req, res);
                });
        })
        .catch(error => {
            Hander.invalidAccessToken(req, res);
        });
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
function handingCannotDestroyFeature(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_delete_feature')]
    }));
}
function getMessage(req, errorMessage) {
    return MessageHelper.getMessage(req.query.lang || 'vi', errorMessage);
}