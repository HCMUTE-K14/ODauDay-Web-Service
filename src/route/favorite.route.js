const Express = require('express');
const FavoriteController = require("../controller/favorite.controller");
const Router = Express.Router();
Router.route('/')
    .get(FavoriteController.getPropertyFavoriteByUser)
    .post(FavoriteController.checkFavorite)
    .delete(FavoriteController.unCheckFavorite)
module.exports=Router;