const Express = require("express");
const PhoneController = require("../controller/phone.cotroller");
const Router = Express.Router();
Router.route('/')
    .get(PhoneController.getPhoneByProperty)
    .post(PhoneController.create)
    .put(PhoneController.update)
    .delete(PhoneController.destroy)

module.exports = Router;