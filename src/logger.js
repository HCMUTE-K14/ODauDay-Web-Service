const Log4js = require('log4js');

const Config = require('./config');

if (Config.env === 'production') {
    Log4js.configure({
        appenders: {
            cheese: {
                type: 'file', filename: 'logs/server.log',
            },
        }, categories: {default: {appenders: ['cheese'], level: 'info'}},
    });
}

const Logger = Log4js.getLogger('Server');


if (Config.env === 'development') {
    Logger.level = 'debug';
}

module.exports = Logger;