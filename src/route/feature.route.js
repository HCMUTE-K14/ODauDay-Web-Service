const Express = require('express');

const FeatureController = require('../controller/feature.controller');

const Router = Express.Router();

Router.route('/')
    .get(FeatureController.getFeatureByProperty)
    .post(FeatureController.create)
    .put(FeatureController.update)
    .delete(FeatureController.destroy)

module.exports = Router;