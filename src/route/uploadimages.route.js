const Express = require("express");
const UploadImagesController = require("../controller/upload-image.controller");
const Router = Express.Router();
Router.route('/upload')
.post(UploadImagesController.uploadImages)
Router.route('/:id')
.get(UploadImagesController.findImage)
module.exports = Router;