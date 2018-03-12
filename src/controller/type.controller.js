const Type = require("../model/index").Type;
const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');

const TypeController={};

TypeController.getAll=getAll;
TypeController.create=create;
TypeController.update=update;
TypeController.destroy=destroy;

module.exports=TypeController;

function getAll(req,res){
    VerifyUtils
    .verifyPublicRequest(req)
    .then(data=>{
        if(data){
            Type.findAll({
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
                handlingCanotGetAllType(req,res);
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
            let type = req.body;
            Type.create(type)
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
                    handlingCannotCreateType(req, res);
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
        let type = req.body;
        let type_id = req.body.id;
        Type.update(type, { where: { id: type_id } })
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
                handlingCannotUpdateType(req, res);
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
            let type_id = req.query.id;
            Type.destroy({
                where: { id: type_id }
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
                    handlingCannotDestroyType(req, res);
                });
        })
        .catch(error => {
            Hander.invalidAccessToken(req, res);
        });
}
function handlingCanotGetAllType(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_get_type')]
    }));
}
function handlingCannotCreateType(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_create_type')]
    }));
}
function handlingCannotUpdateType(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_update_type')]
    }));
}
function handlingCannotDestroyType(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_destroy_type')]
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