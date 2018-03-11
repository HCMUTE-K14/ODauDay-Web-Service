const Express = require('express');

const FeatureController = require('../controller/feature.controller');

const Router = Express.Router();

Router.route('/')
    .post(FeatureController.create)
    .put(FeatureController.update)
    .delete(FeatureController.destroy)

module.exports = Router;