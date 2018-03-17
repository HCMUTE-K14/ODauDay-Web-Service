const JWT = require('jsonwebtoken');

const Config = require('../config');
const Logger = require('../logger');
const TextUtils = require('./text-utils');
const User = require('../model/index').User;
const ErrorModel = require('../util/error-model');

const VerifyUtils = {};
VerifyUtils.verifyPublicRequest = verifyPublicRequest;
VerifyUtils.verifyProtectRequest = verifyProtectRequest;
VerifyUtils.verifyWithSecretToken = verifyWithSecretToken;
VerifyUtils.verifyApiKey = verifyApiKey;


module.exports = VerifyUtils;

function verifyPublicRequest(req) {
    let apiKey = req.headers[Config.header.api_key];

    return verifyApiKey(apiKey);
}

function verifyProtectRequest(req) {
    return new Promise((resolve, reject) => {
        let apiKey = req.headers[Config.header.api_key];
        let accessToken = req.headers[Config.header.access_token];
        let userId = req.headers[Config.header.user_id];

        if (TextUtils.isEmpty(apiKey) || TextUtils.isEmpty(accessToken) || TextUtils.isEmpty(userId)) {
            reject(new ErrorModel('Access token is invalid'));
        } else {
            verifyApiKey(apiKey)
                .then(success => {
                    User.findById(userId)
                        .then(userExists => {
                            verifyWithSecretToken(accessToken)
                                .then(data => {
                                    data.user.role = userExists.role;
                                    resolve(data);
                                })
                                .catch(err => {
                                    reject(new ErrorModel('Access token is invalid'));
                                })
                        })
                        .catch(err => {
                            reject(new ErrorModel('Access token is invalid'));
                        })
                })
                .catch(err => {
                    reject(new ErrorModel('Access token is invalid'));
                })
        }
    });
}

function verifyApiKey(apiKey) {
    return new Promise((resolve, reject) => {
        if (TextUtils.isEmpty(apiKey)) {
            reject(new ErrorModel('Apikey is invalid'));
        } else {
            if (apiKey === Config.api_key) {
                resolve(true);
            }
            reject(new ErrorModel('Apikey is invalid'));
        }
    });
}

function verifyWithSecretToken(token) {
    return new Promise((resolve, reject) => {
        JWT.verify(token, Config.secret_token, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}