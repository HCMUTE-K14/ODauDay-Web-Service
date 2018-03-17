const Express = require('express');

const ImageController = require('../controller/image.controller');

const Router = Express.Router();

Router.route('/')
    .get(ImageController.getImageByProperty)
    .post(ImageController.create)
    .put(ImageController.update)
    .delete(ImageController.destroy)

module.exports = Router;