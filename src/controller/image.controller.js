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



function getImageByProperty(req,res){
    VerifyUtils
    .verifyPublicRequest(req)
    .then(data=>{
        if(data){
            let property_id=req.query.property_id;
            Image.findAll({ where: { property_id: property_id },
                attributes: {
                    include: ['id', 'url']
                } })
            .then(result=>{
                res.status(200).json(new ResponseModel({
                    code: 200,
                    status_text: 'OK',
                    success: true,
                    data: result,
                    errors: null
                }));
            })
            .catch(error=>{
                handlingCanotGetImageByProperty(req,res);
            });
        }else{
            errorVerifyApiKey(req,res);
        }
    })
    .catch(error=>{
        Handler.invalidAccessToken(req, res);
    });
}

function create(req, res) {
    VerifyUtils
        .verifyProtectRequest(req)
        .then(data => {
            let image = req.body;
            Image.create(image)
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
                    handlingCannotCreateImage(req, res);
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
           
            let image = req.body;
            let image_id = req.body.id;
            Image.update(image, { where: { id: image_id } })
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
                    handlingCannotUpdateImage(req, res);
                });

        })
        .catch(error => {
            console.log(error);
            Handler.invalidAccessToken(req, res);
        });
}

function destroy(req, res) {
    VerifyUtils
        .verifyProtectRequest(req)
        .then(data => {
            let image_id = req.query.id;
            Image.destroy({
                where: { id: image_id }
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
                    handlingCannotDestroyImage(req, res);
                });
        })
        .catch(error => {
            Hander.invalidAccessToken(req, res);
        });
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
function handlingCanotGetFeatureByProperty(req,res){
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