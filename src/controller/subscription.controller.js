const User = require('../model/index').User;
const Transaction = require('../model/index').Transaction;
const Premium = require('../model/index').Premium;
const Op = require('../model/index').Sequelize.Op;

const ResponseModel = require('../util/response-model');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');
const Config = require('../config');

const Handler = require('./handling-helper');

const SubscriptionController = {};
SubscriptionController.get = get;
SubscriptionController.subscription = subscription;
SubscriptionController.create = create;
SubscriptionController.update = update;
SubscriptionController.disable = disable;

module.exports = SubscriptionController;

async function get(req, res) {
    try {
        let isAccess = await VerifyUtils.verifyProtectRequest(req);

        let data = await Premium.findAll({
            where: { status: 'active' },
            attributes: {
                exclude: ['date_created', 'date_modified']
            }
        });

        res.status(200).json(new ResponseModel({
            code: 200,
            status_text: 'OK',
            success: true,
            data: data
        }))
    } catch (error) {
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name === 'ErrorModel') {
            Handler.invalidAccessToken(req, res);
        } else {
            res.status(503).json(new ResponseModel({
                code: 503,
                status_text: 'SERVICE UNAVAILABLE',
                success: false,
                data: null,
                errors: [getMessage(req, 'unknown_message')]
            }));
        }
    }
}

async function subscription(req, res) {
    try {
        let isAccess = await VerifyUtils.verifyProtectRequest(req);
        let userIdFromHeader = isAccess.user.id;
        let body = req.body;

        let isSuccess = true; //SEND REQUEST TO PAYMENT GATEWAY

        if (userIdFromHeader != body.user_id) {
            handlingSubcriptionFaliure(req, res);
            return;
        }

        if (isSuccess) {
            let user = await User.findById(userIdFromHeader, {
                attributes: {
                    include: ['id', 'amount']
                }
            });

            let createdTransaction = await Transaction.create({
                status: 'success',
                value: 'amount_real_money',
                user_id: userIdFromHeader,
                payment_gateway_session_id: 'PAYMENT_GATEWAY_SESSION_ID'
            });

            let packPremium = await Premium.findById(body.type_id, {
                attributes: {
                    include: ['id', 'value']
                }
            });

            let dataUpdateUser = { amount: user.amount + packPremium.value };

            User.update(dataUpdateUser, {
                    where: {
                        id: body.user_id
                    }
                }).then(success => {
                    res.status(200).json(new ResponseModel({
                        code: 200,
                        status_text: 'OK',
                        success: true,
                        data: getMessage(req, 'subscription_success')
                    }));
                })
                .catch(error => {
                    handlingSubcriptionFaliure(req, res);
                })

        } else {
            let createdTransaction = Transaction.create({
                status: 'failure',
                value: 'amount_real_money',
                user_id: userIdFromHeader,
                payment_gateway_session_id: 'PAYMENT_GATEWAY_SESSION_ID'
            });
            handlingSubcriptionFaliure(req, res);
        }
    } catch (error) {
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name === 'ErrorModel') {
            Handler.invalidAccessToken(req, res);
        } else {
            res.status(503).json(new ResponseModel({
                code: 503,
                status_text: 'SERVICE UNAVAILABLE',
                success: false,
                data: null,
                errors: [getMessage(req, 'create_subscription_failure')]
            }));
        }
    }
}

async function create(req, res) {
    try {
        let isAccess = VerifyUtils.verifyProtectRequest(req);
        if (isAccess.user.role !== 'admin') {
            Handler.unAuthorizedAdminRole(req, res);
            return;
        }
        let data = req.body;
        let created = await Premium.create(data);

        if (created) {
            res.status(200).json(new ResponseModel({
                code: 200,
                status_text: 'OK',
                success: true,
                data: getMessage(req, 'create_subscription_success')
            }));
        } else {
            handlingCreateSubscriptionFailure(req, res);
        }
    } catch (error) {
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name === 'ErrorModel') {
            Handler.invalidAccessToken(req, res);
        } else {
            handlingCreateSubscriptionFailure(req, res);
        }
    }
}

async function update(req, res) {
    try {
        let isAccess = VerifyUtils.verifyProtectRequest(req);
        if (isAccess.user.role !== 'admin') {
            Handler.unAuthorizedAdminRole(req, res);
            return;
        }
        let data = req.body;

        delete data.status;
        delete data.id;

        let updated = await Premium.update(data, { where: { id: req.params.id } })
        if (updated) {
            res.status(200).json(new ResponseModel({
                code: 200,
                status_text: 'OK',
                success: true,
                data: getMessage(req, 'update_subscription_success')
            }));
        } else {
            handlingUpdateSubscriptionFailure(req, res);
        }
    } catch (error) {
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name === 'ErrorModel') {
            Handler.invalidAccessToken(req, res);
        } else {
            handlingUpdateSubscriptionFailure(req, res);
        }
    }
}

async function disable(req, res) {
    try {
        let isAccess = VerifyUtils.verifyProtectRequest(req);
        if (isAccess.user.role !== 'admin') {
            Handler.unAuthorizedAdminRole(req, res);
            return;
        }
        let updated = Premium.update({ status: 'disable' }, { where: { id: req.params.id } })

        if (updated) {
            res.status(200).json(new ResponseModel({
                code: 200,
                status_text: 'OK',
                success: true,
                data: getMessage(req, 'update_subscription_success')
            }));
        } else {
            handlingUpdateSubscriptionFailure(req, res);
        }
    } catch (error) {
        if (error.constructor.name === 'ConnectionRefusedError') {
            Handler.cannotConnectDatabase(req, res);
        } else if (error.constructor.name === 'ValidationError' ||
            error.constructor.name === 'UniqueConstraintError') {
            Handler.validateError(req, res, error);
        } else if (error.constructor.name === 'ErrorModel') {
            Handler.invalidAccessToken(req, res);
        } else {
            handlingUpdateSubscriptionFailure(req, res);
        }
    }
}

function handlingSubcriptionFaliure(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'subscription_failure')]
    }));
}

function handlingUpdateSubscriptionFailure(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'update_subscription_failure')]
    }));
}

function handlingCreateSubscriptionFailure(req, res) {
    res.status(503).json(new ResponseModel({
        code: 503,
        status_text: 'SERVICE UNAVAILABLE',
        success: false,
        data: null,
        errors: [getMessage(req, 'create_subscription_failure')]
    }));
}

function getMessage(req, errorText) {
    let lang = req.query.lang || 'vi';
    return MessageHelper.getMessage(lang, errorText);
}