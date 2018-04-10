const Express = require("express");
const SearchController = require("../controller/search.controller");
const Router = Express.Router();
Router.route('/')
    .get(SearchController.getSearchByUser)
    .post(SearchController.saveSearch)
    .delete(SearchController.removeSearch)

module.exports = Router;