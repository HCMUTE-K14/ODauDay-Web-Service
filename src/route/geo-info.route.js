const Express = require('express');

const GeoInforController = require('../controller/geo-info-by-latlng.controller');

const Router = Express.Router();

Router.route('/')
    .get(GeoInforController.search);
Router.route('/test')
    .get(GeoInforController.search1);

module.exports = Router;