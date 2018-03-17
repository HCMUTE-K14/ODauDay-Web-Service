const Category = require("../model/index").Category;
const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');

const CategoryController={};

CategoryController.getAll=getAll;
CategoryController.create=create;
CategoryController.update=update;
CategoryController.destroy=destroy;

module.exports=CategoryController;


function getAll(req,res){

    let verify=await VerifyUtils.verifyPublicRequest(req);
    if(!verify){

    }else{

    }

    
    VerifyUtils
    .verifyPublicRequest(req)
    .then(data=>{
        if(data){
            Category.findAll({
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
                handlingCanotGetAllCategory(req,res);
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
        let category = req.body;
        Category.create(category)
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
                handlingCannotCreateCategory(req, res);
            })
    })
    .catch(error => {
        Handler.invalidAccessToken(req, res);
    });
}
function update(req,res){
    VerifyUtils
    .verifyProtectRequest(req)
    .then(data=>{
        if (data.user.role != 'admin') {
            Handler.unAuthorizedAdminRole(req, res);
            return;
        }
        let category = req.body;
        let categoey_id = req.body.id;
        Category.update(category, { where: { id: categoey_id } })
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
                handlingCannotUpdateCategory(req, res);
            });
    })
    .catch(error=>{
        Handler.invalidAccessToken(req,res);
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
            let categoey_id = req.query.id;
            Category.destroy({
                where: { id: categoey_id }
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
                    handlingCannotDestroyCategory(req, res);
                });
        })
        .catch(error => {
            Hander.invalidAccessToken(req, res);
        });
}
function handlingCanotGetAllCategory(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_get_category')]
    }));
}
function handlingCannotCreateCategory(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_create_category')]
    }));
}
function handlingCannotUpdateCategory(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_update_category')]
    }));
}
function handlingCannotDestroyCategory(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req,'can_not_destroy_category')]
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

function getMessage(req,errorText){
    return MessageHelper.getMessage(req.query.lang||'vi',errorText);
}