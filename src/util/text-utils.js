const Bcrypt = require('bcryptjs');

const TextUtils = {};

TextUtils.isEmpty = isEmpty;
TextUtils.hash = hash;

module.exports = TextUtils;

function isEmpty(str) {
    return str === null || str.length === 0 || str === undefined;
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
