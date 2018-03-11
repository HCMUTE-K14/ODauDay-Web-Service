const Express = require('express');
const BodyParse = require('body-parser');
const CookieParser = require('cookie-parser');
const Logger = require('morgan');

const Config = require('./config');
const Routes = require('./route/main.route');

const App = Express();

App.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers',
        'X-Requested-With, Content-Type, charset, token, x-api-key, x-access-token, x-user-id');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

App.use(BodyParse.json());
App.use(BodyParse.urlencoded({ extended: false }));
App.use(CookieParser());
App.use('/', Routes);
if (Config.env === 'development') {
	App.use(Logger("dev"));
}
App.set('port', (Config.port || 3000));

module.exports = App;