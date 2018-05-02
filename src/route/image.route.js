const Express = require('express');

const ImageController = require('../controller/image.controller');

const Router = Express.Router();


Router.route('/upload')
    .post(ImageController.upload);


Router.route('/:name')
    .get(ImageController.get);



module.exports = Router;