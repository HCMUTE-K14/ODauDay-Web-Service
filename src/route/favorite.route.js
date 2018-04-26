const Express = require('express');
const FavoriteController = require("../controller/favorite.controller");
const Router = Express.Router();
Router.route('/')
    .get(FavoriteController.getPropertyFavoriteByUser)
    .post(FavoriteController.checkFavorite)
    .delete(FavoriteController.unCheckFavorite)
Router.route('/all')
    .delete(FavoriteController.unCheckFavorites)
Router.route('/share')
    .post(FavoriteController.sharePropertyFavoriteToMail)

module.exports = Router;