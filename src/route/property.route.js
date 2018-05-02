const Express = require('express');
const Middleware = require('multer')({ dest: 'uploads/' });
const PropertyController = require('../controller/property.controller');

const Router = Express.Router();

Router.route('/')
	.post(Middleware.fields([{ name: 'property' }, { name: 'file' }]), PropertyController.create);


module.exports = Router;