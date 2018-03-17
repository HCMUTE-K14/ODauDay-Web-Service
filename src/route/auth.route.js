const Express = require('express');

const UserController = require('../controller/user.controller');

const Router = Express.Router();

Router.route('/')
    .post(UserController.login)
<<<<<<< HEAD
    .put(UserController.create);
=======
>>>>>>> 225a7758de6c7f2ea535f8096e2838df9f6cc875


// Router.route('/facebook')
//     .post(UserController.login);



module.exports = Router;