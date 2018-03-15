const Express = require("express");
const EmailController = require("../controller/email.controller");
const Router = Express.Router();
Router.route('/')
    .get(EmailController.getEmailByProperty)
    .post(EmailController.create)
    .put(EmailController.update)
    .delete(EmailController.destroy)

module.exports = Router;