const ResponseModel = require('../util/response-model');
const Notification = require("../model/index").Notification;
const VerifyUtils = require('../util/verify-request');
const NumberUtils = require('../util/number-utils');
const MessageHelper = require('../util/message/message-helper');
const Handler = require('./handling-helper');
const NotificationUtils = require("./notification/notificationUtils");
const NotificationController = {};
NotificationController.sendNotification = sendNotification;
NotificationController.saveRegistrationTokenForUser=saveRegistrationTokenForUser;
module.exports = NotificationController;

async function sendNotification(req, res) {
    try {
        let verify = await VerifyUtils.verifyProtectRequest(req);
        let data=req.body;
        var payload = {
            data: {
                user_id: data.user_id,
                property_id: data.property_id,
                image: data.image,
                type: data.type
            },
            notification: {
                title: data.title,
                body: data.body
            }
        };
        let notifications=await Notification.findAll({where: {user_id:data.user_id}});
        if(notifications.length==0){
            responseData(res, MessageHelper.getMessage(req.query.lang || 'vi', "cannot_send_notification"));
        }else{
            var registrationToken=getRegistrationToken(notifications);
            NotificationUtils.sendNotification(registrationToken,payload);
            responseData(res, MessageHelper.getMessage(req.query.lang || 'vi', "send_notification_success"));
        }
        
    } catch (error) {
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name == 'ErrorModel') {
            Handler.handlingErrorModel(res, error);
        } else {
            handlingCanotSendNotification(req, res);
        }
    }
}
async function saveRegistrationTokenForUser(req, res){
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);
        let notification = req.body;
        let data = await Notification.create(notification);
        responseData(res, MessageHelper.getMessage(req.query.lang || 'vi', "save_registration_token_success"));

    }catch(error){
        console.log("lang thag ",error);
        if (error.constructor.name === 'ConnectionRefusedError') {
			Handler.cannotConnectDatabase(req, res);
		} else if (error.constructor.name === 'ValidationError' ||
			error.constructor.name === 'UniqueConstraintError') {
			Handler.validateError(req, res, error);
		} else if (error.constructor.name == 'ErrorModel') {
			Handler.handlingErrorModel(res, error);
		} else {
			handlingCannotRegistrationSaveToken(req, res);
		}
    }
}
function getRegistrationToken(notifications){
    var arrayToken = [];
    notifications.forEach(function(item) {
        arrayToken.push(item.registration_token);
    });
    return arrayToken;
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
function handlingCanotSendNotification(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'cannot_send_notification')]
    }));
}
function handlingCannotRegistrationSaveToken(req,res){
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'cannot_save_registration_token')]
    }));
}
function getMessage(req, errorText) {
    let lang = req.query.lang || 'vi';
    return MessageHelper.getMessage(lang, errorText);
}
