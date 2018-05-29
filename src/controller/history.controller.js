const Database = require('../model/index');
const User = Database.User;
const Property = Database.Property;
const History = Database.History;

const ResponseModel = require('../util/response-model');
const VerifyUtils = require('../util/verify-request');
const NumberUtils = require('../util/number-utils');
const MessageHelper = require('../util/message/message-helper');
const Handler = require('./handling-helper');
const IncludeModelProperty = require('../util/include-model');

const HistoryController = {};
HistoryController.clearHistory = clearHistory;
HistoryController.create = create;
HistoryController.getDetails = getDetails;

module.exports = HistoryController;

async function create(req, res) {
    try {
        let isAccess = await VerifyUtils.verifyProtectRequest(req);
        let userIdFromHeader = isAccess.user.id;
        let history = req.body;
        if (history.user_id === userIdFromHeader) {
            let data = await History.create(history);
            res.status(200).json(new ResponseModel({
                code: 200,
                status_text: 'OK',
                success: true,
                data: getMessage(req, 'create_history_successful'),
                errors: null
            }));
        } else {
            res.status(503).json(new ResponseModel({
                code: 503,
                status_text: 'SERVICE UNAVAILABLE',
                success: false,
                data: null,
                errors: [getMessage(req, 'history_user_id_not_match')]
            }));
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
            res.status(503).json(new ResponseModel({
                code: 503,
                status_text: 'SERVICE UNAVAILABLE',
                success: false,
                data: null,
                errors: [getMessage(req, 'create_history_failure')]
            }));
        }
    }
}

function handlingCannotCreateHistory(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'cannot_clear_history')]
    }));
}

async function getDetails(req, res) {
    try {
        let isAccess = await VerifyUtils.verifyProtectRequest(req);
        let userIdFromHeader = isAccess.user.id;

        let count = await History.count({ where: { user_id: userIdFromHeader } });
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
                    userId: userIdFromHeader,
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

async function clearHistory(req, res) {
    try {
        let verify = await VerifyUtils.verifyProtectRequest(req);
        let user_id = req.query.user_id;
        let data = await History.destroy({ where: { user_id: user_id } });
        responseData(res, MessageHelper.getMessage(req.query.lang || 'vi', "clear_history_success"));
    } catch (error) {
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name == 'ErrorModel') {
            Handler.handlingErrorModel(res, error);
        } else {
            handlingCannotClearHistory(req, res);
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

function handlingCannotClearHistory(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'cannot_clear_history')]
    }));
}

function getMessage(req, errorText) {
    let lang = req.query.lang || 'vi';
    return MessageHelper.getMessage(lang, errorText);
}