const Express = require('express');

const FavoriteController = require('../controller/favorite.controller');

const Router = Express.Router();

Router.route('/')
    .post(FavoriteController.create)
    .delete(FavoriteController.remove)


Router.route('/:id')
    .get(FavoriteController.getByUserId);

module.exports = Router;