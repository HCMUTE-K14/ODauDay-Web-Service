const Express = require('express');

const FeatureController = require('../controller/feature.controller');

const Router = Express.Router();

Router.route('/')
    .post(FeatureController.createFeature)

module.exports = Router;