const Tag = require("../model/index").Tag;
const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');

const TagController={};

TagController.getAll=getAll;
TagController.create=create;
TagController.update=update;
TagController.destroy=destroy;

module.exports=TagController;

function getAll(req,res){
    VerifyUtils
    .verifyPublicRequest(req)
    .then(data=>{
        if(data){
            Tag.findAll({
                order: [
                    ['name', 'ASC']
                ]
            })
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
                handlingCanotGetAllTag(req,res);
            });
        }else{
            errorVerifyApiKey(req,res);
        }
    })
    .catch(error=>{
        Handler.invalidAccessToken(req, res);
    });
}

function create(req,res){
    VerifyUtils
        .verifyProtectRequest(req)
        .then(data => {
            if (data.user.role != 'admin') {
                Handler.unAuthorizedAdminRole(req, res);
                return;
            }
            let tag = req.body;
            Tag.create(tag)
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
                    handlingCannotCreateTag(req, res);
                })
        })
        .catch(error => {
            Handler.invalidAccessToken(req, res);
        });
}
function update(req,res){
    VerifyUtils
    .verifyProtectRequest(req)
    .then(data => {
        if (data.user.role != 'admin') {
            Handler.unAuthorizedAdminRole(req, res);
            return;
        }
        let tag = req.body;
        let tag_id = req.body.id;
        Tag.update(tag, { where: { id: tag_id } })
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
                handlingCannotUpdateTag(req, res);
            });

    })
    .catch(error => {
        Handler.invalidAccessToken(req, res);
    });
}
function destroy(req,res){
    VerifyUtils
        .verifyProtectRequest(req)
        .then(data => {
            if (data.user.role != 'admin') {
                Handler.unAuthorizedAdminRole(req, res);
                return;
            }
            let tag_id = req.query.id;
            Tag.destroy({
                where: { id: tag_id }
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
                    handlingCannotDestroyTag(req, res);
                });
        })
        .catch(error => {
            Hander.invalidAccessToken(req, res);
        });
}
function handlingCanotGetAllTag(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_get_tag')]
    }));
}
function handlingCannotCreateTag(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_create_tag')]
    }));
}
function handlingCannotUpdateTag(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_update_tag')]
    }));
}
function handlingCannotDestroyTag(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_destroy_tag')]
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