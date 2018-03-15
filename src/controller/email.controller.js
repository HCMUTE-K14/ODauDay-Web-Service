const Email = require("../model/index").Email;
const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');

const EmailController={};

EmailController.getEmailByProperty=getEmailByProperty;
EmailController.create=create;
EmailController.update=update;
EmailController.destroy=destroy;

module.exports=EmailController;

function getEmailByProperty(req,res){
    VerifyUtils
    .verifyPublicRequest(req)
    .then(data=>{
        if(data){
            let property_id=req.query.property_id;
            Email.findAll({ where: { property_id: property_id } })
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
                handlingCanotGetEmailByProperty(req,res);
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
            let email = req.body;
            console.log(email);
            Email.create(email)
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
                    handlingCannotCreateEmail(req, res);
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
        let email = req.body;
        let email_id = req.body.id;
        Email.update(email, { where: { id: email_id } })
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
                handlingCannotUpdateEmail(req, res);
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
            let email_id = req.query.id;
            Email.destroy({
                where: { id: email_id }
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
                    handlingCannotDestroyEmail(req, res);
                });
        })
        .catch(error => {
            Hander.invalidAccessToken(req, res);
        });
}
function handlingCanotGetEmailByProperty(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_get_email_by_property')]
    }));
}
function handlingCannotCreateEmail(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_create_email')]
    }));
}
function handlingCannotUpdateEmail(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_update_email')]
    }));
}
function handlingCannotDestroyEmail(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_destroy_email')]
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