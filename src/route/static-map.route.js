
const Express = require('express');

const StaticMapController = require('../controller/static-map.controller');
const Router = Express.Router();

Router.route('/')
    .get(StaticMapController.get);

module.exports = Router;