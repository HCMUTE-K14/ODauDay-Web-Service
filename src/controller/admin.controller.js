
const Sequelize = require('sequelize');
const Property = require("../model/index").Property;
const User = require("../model/index").User;
const History = require("../model/index").History;
const Image = require("../model/index").Image;
const Database = require('../model/index');
const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');
const NotificationController=require("./notification.controller");
const IncludeModeProperty = require('../util/include-model');
const Op = Sequelize.Op;
const AdminController = {};
AdminController.getPropertyByAdmin = getPropertyByAdmin;
AdminController.getUserByAdmin=getUserByAdmin;
AdminController.changeStatusUser=changeStatusUser;
AdminController.changeStatusProperty=changeStatusProperty;
AdminController.getHistoryByUser=getHistoryByUser;
module.exports = AdminController;

async function getPropertyByAdmin(req, res) {
    try {
        let verify = await VerifyUtils.verifyProtectRequest(req);
        if (verify.user.role != 'admin') {
            Handler.unAuthorizedAdminRole(req, res);
            return;
        }
        let data;
        let status=req.query.status;
        let page = parseInt(req.query.page || 1);
        let limit = parseInt(req.query.limit || 5);
        let likeName=req.query.likename||'';
        limit = limit <= 0 ? 5 : limit;
        let offset = 0;

        if(status=='all'){
            let count_data = await Property.count();
            let pages = Math.ceil(count_data /limit);
            offset = limit * (page - 1);
    
           data = await Property.findAll({
                include: IncludeModeProperty.getModelProperty(),
                where:{
                    address: {
                        [Op.like]: '%'+likeName+'%'
                    }
                },
                limit: limit,
                offset: offset,
                order: [
                    ['date_created', 'ASC']
                ]
            });
        }else{
            let count_data = await Property.count({ where: { 'status': status } });
            let pages = Math.ceil(count_data /limit);
            offset = limit * (page - 1);
    
            data = await Property.findAll({
                where: { 
                    'status': status,
                    address: {
                        [Op.like]: '%'+likeName+'%'
                    }
                },
                include: IncludeModeProperty.getModelProperty(),
                limit: limit,
                offset: offset,
                order: [
                    ['date_created', 'ASC']
                ]
            });
        }
        
        responseData(res, data);
    }catch (error) {
        console.log("lang thang"+error);
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name == 'ErrorModel') {
            Handler.handlingErrorModel(res, error);
        } else {
            handlingCanotGetProperty(req, res);
        }
    }

}
async function getUserByAdmin(req, res) {
	try {
		let verify = await VerifyUtils.verifyProtectRequest(req);
		if (verify.user.role != 'admin') {
			Handler.unAuthorizedAdminRole(req, res);
			return;
		}
		let data;
		let status = req.query.status;
		let page = parseInt(req.query.page || 1);
		let limit = parseInt(req.query.limit || 5);
		let likeName = req.query.likename || '';
		limit = limit <= 0 ? 5 : limit;
		let offset = 0;

		if (status == 'all') {
			let count_data = await User.count();
			let pages = Math.ceil(count_data / limit);
			offset = limit * (page - 1);
			data = await User.findAll({
				attributes: ['id', 'email', 'display_name', 'phone', 'avatar', 'status', 'amount', 'role'],
				where: {
					[Op.or]: [
						{
							email: {
								[Op.like]: '%' + likeName + '%'
							}
						},
						{
							display_name: {
								[Op.like]: '%' + likeName + '%'
							}
						}
					]
				},
				limit: limit,
				offset: offset,
				order: [
					['date_created', 'DESC']
				]
			});
		} else {
			let count_data = await User.count({ where: { 'status': status } });
			let pages = Math.ceil(count_data / limit);
			offset = limit * (page - 1);

			data = await User.findAll({
				attributes: ['id', 'email', 'display_name', 'phone', 'avatar', 'status', 'amount', 'role'],
				where: {
					'status': status,
					[Op.or]: [
						{
							email: {
								[Op.like]: '%' + likeName + '%'
							}
						},
						{
							display_name: {
								[Op.like]: '%' + likeName + '%'
							}
						}
					]
				},
				limit: limit,
				offset: offset,
				order: [
					['date_created', 'DESC']
				]
			});
		}
		responseData(res, data);
	} catch (error) {
		console.log("lang thang" + error);
		if (error.constructor.name === 'ConnectionRefusedError') {
			Handler.cannotConnectDatabase(req, res);
		} else if (error.constructor.name === 'ValidationError' ||
			error.constructor.name === 'UniqueConstraintError') {
			Handler.validateError(req, res, error);
		} else if (error.constructor.name == 'ErrorModel') {
			Handler.handlingErrorModel(res, error);
		} else {
			handlingCanotGetUser(req, res);
		}
	}

}
async function changeStatusUser(req, res) {
	try {
		let verify = await VerifyUtils.verifyProtectRequest(req);
		if (verify.user.role != 'admin') {
			Handler.unAuthorizedAdminRole(req, res);
			return;
		}
		let user_id = req.query.id;
		let status = req.query.status;
		let data = await User.update({ status: status }, { where: { id: user_id } })

		responseData(res, MessageHelper.getMessage(req.query.lang || 'vi', "change_status_success"));
	} catch (error) {
		console.log("lang thang"+error);
		if (error.constructor.name === 'ConnectionRefusedError') {
			Handler.cannotConnectDatabase(req, res);
		} else if (error.constructor.name === 'ValidationError' ||
			error.constructor.name === 'UniqueConstraintError') {
			Handler.validateError(req, res, error);
		} else if (error.constructor.name == 'ErrorModel') {
			Handler.handlingErrorModel(res, error);
		} else {
			handlingCannotChangeStatusUser(req, res);
		}
	}
}
async function changeStatusProperty(req,res){
	try {
		let verify = await VerifyUtils.verifyProtectRequest(req);
		if (verify.user.role != 'admin') {
			Handler.unAuthorizedAdminRole(req, res);
			return;
		}
		let property_id = req.query.id;
		let status=req.query.status;
        let data = await Property.update({status:status}, { where: { id: property_id } })
		if(status=='active'||status=='expired'){
            let property= await Property.findOne({ where: { id: property_id },
                include: [{
					model: Image,
					as: 'images',
					attributes: ['id', 'url']
				}]
             });
             let image="";
             if(property.images.length>0){
                image=property.images[0].url;
             }
            let payload=getPayload(property.user_id_created,property.id,property.address,image,status,req);
            console.log("Bomkaka:",payload);
            NotificationController.sendNotificatinoToUser(payload,property.user_id_created)
        }
        responseData(res, MessageHelper.getMessage(req.query.lang || 'vi', "change_status_success"));
    } catch (error) {
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name == 'ErrorModel') {
            Handler.handlingErrorModel(res, error);
        } else {
            handlingCannotChangeStatusProperty(req, res);
        }
    }
}
async function getHistoryByUser(req, res){
	try {
		let isAccess = await VerifyUtils.verifyProtectRequest(req);
		console.log("lang thang dkslfjdsk 1");
		if (isAccess.user.role != 'admin') {
			Handler.unAuthorizedAdminRole(req, res);
			return;
		}
        let user_id = req.query.user_id;

        let count = await History.count({ where: { user_id: user_id} });
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        if (page <= 0) {
            page = 1;
        }

        if (limit <= 0) {
            limit = 10;
		}
		
        let totalPage = Math.ceil(count / limit);
        let offset = limit * (page - 1);

        Database.sequelize
            .query('SELECT tbl_property.id, tbl_history.date_created, tbl_property.num_of_bedroom, tbl_property.num_of_bathroom, tbl_property.num_of_parking, tbl_property.address FROM tbl_history, tbl_property WHERE tbl_history.user_id = $userId AND tbl_history.property_id = tbl_property.id LIMIT $offset, $limit', {
                bind: {
                    userId: user_id,
                    offset: offset,
                    limit: limit
                }
            })
            .then(histories => {
                if (histories[0].length <= 0) {
                    res.status(200).json(new ResponseModel({
                        code: 200,
                        status_text: 'OK',
                        success: true,
                        data: { pages: 0, count: 0, histories: [] },
                        errors: null
                    }));
                }
                formatHistoryDetails(histories[0])
                    .then(result => {
                        res.status(200).json(new ResponseModel({
                            code: 200,
                            status_text: 'OK',
                            success: true,
                            data: { pages: totalPage, count: count, histories: result },
                            errors: null
                        }));
                    })
            })
            .catch(error => {
                res.json(error);
            })
    } catch (error) {
		console.log(error);
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name == 'ErrorModel') {
            Handler.handlingErrorModel(res, error);
        } else {
            res.status(503).json(new ResponseModel({
                code: 503,
                status_text: 'SERVICE UNAVAILABLE',
                success: false,
                data: null,
                errors: [getMessage(req, 'cannot_get_history_detail')]
            }));
        }
    }
}
function formatHistoryDetails(list) {
    return new Promise((resolve, reject) => {
        let size = list.length;
        let result = [];
        for (let i = 0; i < size; i++) {
            loadImageForHistoryDetail(list[i])
                .then(data => {
                    result.push(data);
                    if (i == size - 1) {
                        resolve(result);
                    }
                })
        }
    })
}
function getPayload(user_id,property_id,address,image,status,req){
    var payload={};
    if(status=='active'){
        payload = {
            data: {
                user_id: user_id,
                property_id: property_id,
                image: image,
                type: "1"
            },
            notification: {
                title: getMessage(req,"notification_confirmed_property").title,
                body: getMessage(req,"notification_confirmed_property").body+address
            }
        };
    }else{
        payload = {
            data: {
                user_id: user_id,
                property_id: property_id,
                image: image,
                type: "1"
            },
            notification: {
                title: getMessage(req,"notification_room_expired").title,
                body: getMessage(req,"notification_room_expired").body+address
            }
        };
    }
	return payload;
}
function loadImageForHistoryDetail(detail) {
    return new Promise((resolve, reject) => {
        Database.Image.findOne({
                where: { property_id: detail.id },
                attributes: {
                    exclude: ['id', 'property_id', 'date_created', 'updatedAt']
                }
            })
            .then(images => {
                if (images) {
                    detail.images = [images];
                }
                resolve(detail);
            }).catch(err => {
                detail.images = [];
                resolve(detail);
            })
    })
}
function handlingCanotGetHistoryForUser(req,res){
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'cannot_get_history_detail')]
	}));
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
function handlingCannotChangeStatusProperty(req,res){
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'can_not_change_status')]
	}))
}
function handlingCannotChangeStatusUser(req, res) {
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'can_not_change_status')]
	}))
}
function handlingCanotGetUser(req,res){
	res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'can_not_get_user_by_admin')]
	}))
}
function handlingCanotGetProperty(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'can_not_get_property')]
    }));
}
function getMessage(req, errorText) {
    return MessageHelper.getMessage(req.query.lang || 'vi', errorText);
}