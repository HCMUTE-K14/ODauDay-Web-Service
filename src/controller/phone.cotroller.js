const Phone = require("../model/index").Phone;
const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');

const PhoneController={};

PhoneController.getPhoneByProperty=getPhoneByProperty;
PhoneController.create=create;
PhoneController.update=update;
PhoneController.destroy=destroy;

module.exports=PhoneController;

function getPhoneByProperty(req,res){
    VerifyUtils
    .verifyPublicRequest(req)
    .then(data=>{
        if(data){
            let property_id=req.query.property_id;
            Phone.findAll({ where: { property_id: property_id } })
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
                handlingCanotGetPhoneByProperty(req,res);
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
            // if (data.user.role != 'admin') {
            //     Handler.unAuthorizedAdminRole(req, res);
            //     return;
            // }
            let phone = req.body;
            Phone.create(phone)
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
                    handlingCannotCreatePhone(req, res);
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
        // if (data.user.role != 'admin') {
        //     Handler.unAuthorizedAdminRole(req, res);
        //     return;
        // }
        let phone = req.body;
        let phone_id = req.body.id;
        Phone.update(phone, { where: { id: phone_id } })
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
                handlingCannotUpdatePhone(req, res);
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
            // if (data.user.role != 'admin') {
            //     Handler.unAuthorizedAdminRole(req, res);
            //     return;
            // }
            let phone_id = req.query.id;
            Phone.destroy({
                where: { id: phone_id }
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
                    handlingCannotDestroyPhone(req, res);
                });
        })
        .catch(error => {
            Hander.invalidAccessToken(req, res);
        });
}
function handlingCanotGetPhoneByProperty(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_get_phone_by_property')]
    }));
}
function handlingCannotCreatePhone(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_create_phone')]
    }));
}
function handlingCannotUpdatePhone(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_update_phone')]
    }));
}
function handlingCannotDestroyPhone(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_destroy_phone')]
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