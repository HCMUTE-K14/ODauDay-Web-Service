const Search = require("../model/index").Search;
const User=require("../model/index").User;
const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');

const SearchController={};

SearchController.getSearchByUser=getSearchByUser;
SearchController.saveSearch=saveSearch;
SearchController.removeSearch=removeSearch;

module.exports=SearchController;

async function getSearchByUser(req,res){
	try {
        let verify = await VerifyUtils.verifyPublicRequest(req);
        let query={id:req.query.id};
        let data = await User.findOne({
			where: query,
            include: [
				{
                    model: Search,
                    as:'searches',
                    attributes: ['id','name', 'latitude', 'longitude','date_created']
                }
            ],
            order:[
                [{model: Search, as:'searches'},'date_created','DESC']
            ],
            attributes:['id']
        });
        responseData(res, data);
    } catch (error) {
        console.log("lang thang:"+error);
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name == 'ErrorModel') {
            Handler.handlingErrorModel(res, error);
        } else {
            handlingCannotGetSearchByUser(req, res);
        }
    }
}
async function saveSearch(req,res){
    try {
        let verify = await VerifyUtils.verifyProtectRequest(req);
        let search=req.body;
        let data = await Search.create(search);
        responseData(res, MessageHelper.getMessage(req.query.lang || 'vi', "save_search_success"));
    } catch (error) {
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name == 'ErrorModel') {
            Handler.handlingErrorModel(res, error);
        } else {
           handlingCannotSaveSearch(req, res);
        }
    }
}
async function removeSearch(req,res){
    try{
        let verify=await VerifyUtils.verifyProtectRequest(req);
        let search_id=req.query.id;
        let data=await Search.destroy({where:{id: search_id}});
        responseData(res,MessageHelper.getMessage(req.query.lang||'vi','remove_search_success'))
    }catch(error){
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name == 'ErrorModel') {
            Handler.handlingErrorModel(res, error);
        } else {
           handlingCannotRemoveSearch(req, res);
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
function handlingCannotGetSearchByUser(req,res){
    res.status(503).json(new ResponseModel({
		code: 503,
		status_text: 'SERVICE UNAVAILABLE',
		success: false,
		data: null,
		errors: [getMessage(req, 'cannot_get_search_by_user')]
	}));
}
function handlingCannotSaveSearch(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text:'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors:[getMessage(req,'cannot_save_search')]
    }));
}
function handlingCannotRemoveSearch(req,res){
    res.status(503).json(new ResponseModel({
        code:503,
        status_text:'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors:[getMessage(req,'cannot_remove_search')]
    }));
}
function getMessage(req, errorText) {
	let lang = req.query.lang || 'vi';
	return MessageHelper.getMessage(lang, errorText);
}