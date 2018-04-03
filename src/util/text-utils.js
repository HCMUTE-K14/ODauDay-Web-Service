const Bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const Crypto = require('crypto');

const Config = require('../config');

const DAY_IN_WEEK = 7;
const HOUR_IN_DAY = 24;
const HOUR_IN_SECOND = 3600;
const SECOND_IN_MILISECOND = 1000;

const TextUtils = {};

TextUtils.isEmpty = isEmpty;
TextUtils.hash = hash;
TextUtils.hashMD5 = hashMD5;
TextUtils.generateTokenAccount = generateTokenAccount;
TextUtils.generateLinkActivateAccount = generateLinkActivateAccount;
TextUtils.generateLinkResendActivateAccount = generateLinkResendActivateAccount;
TextUtils.generateLinkForgotPassword = generateLinkForgotPassword;
TextUtils.generateString = generateString;

module.exports = TextUtils;

function isEmpty(str) {
    return str === null || str === undefined || str.length === 0;
}

function hash(str) {
    return new Promise((resolve, reject) => {
        Bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                reject(err);
            }
            Bcrypt.hash(str, salt, (error, hash) => {
                if (error) {
                    reject(error);
                }
                resolve(hash);
            });
        });
    });
}

function hashMD5(str) {
    return Crypto.createHash('md5')
        .update(str)
        .digest("hex");
}

function generateLinkResendActivateAccount(email) {
    return Config.base_url + '/users/resend-activation?email=' + email;
}

function generateLinkActivateAccount(user) {
    let token = generateTokenAccount(user, 'active_account');

    return Config.base_url + '/users/active?token=' + token;
}

function generateLinkForgotPassword(user) {
    let token = generateTokenAccount(user, 'forgot_password');

    return Config.base_url + '/users/confirm-password-change?token=' + token;
}

function generateString() {
    return Math.random().toString(36).slice(-8);
}

function generateTokenAccount(user, method) {

    let hashPing = hashMD5(Config.secret_token + user.ping_number.toString());

    let newUser = {
        id: user.id,
        email: user.email,
        status: user.status,
        ping_number: hashPing
    };

    let timeStampUserCreated = new Date(user.date_created).getTime();
    let timeStampOf1Week = DAY_IN_WEEK * HOUR_IN_DAY * HOUR_IN_SECOND * SECOND_IN_MILISECOND; //7 days
    let timeExpired = new Date(timeStampUserCreated + timeStampOf1Week);

    let data = {
        method: method,
        user: newUser,
        time_to_expried: {
            date: timeExpired,
            timestamp: timeExpired.getTime()
        }
    }

    return JWT.sign({ data: data }, Config.secret_token);
}