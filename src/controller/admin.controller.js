
const Sequelize = require('sequelize');
const Property = require("../model/index").Property;
const User = require("../model/index").User;
const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');
const Op = Sequelize.Op;
const AdminController = {};
AdminController.getPropertyByAdmin = getPropertyByAdmin;
AdminController.getUserByAdmin=getUserByAdmin;
AdminController.changeStatusUser=changeStatusUser;
AdminController.changeStatusProperty=changeStatusProperty;
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
                attributes: ['id','address', 'status', 'price', 'num_of_bedroom', 'num_of_bathroom', 'num_of_parking', 'user_id_created', 'type_id','date_created'],
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
                attributes: ['id','address', 'status', 'price', 'num_of_bedroom', 'num_of_bathroom', 'num_of_parking', 'user_id_created', 'type_id','date_created'],
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