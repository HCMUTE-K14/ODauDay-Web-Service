const Express = require('express');

const AutoComplete = require('../controller/auto-complete-place.controller');
const Router = Express.Router();

Router.route('/')
    .get(AutoComplete.search);



module.exports = Router;