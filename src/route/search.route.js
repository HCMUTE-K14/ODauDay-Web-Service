
const Express = require('express');

const SearchController = require('../controller/search.controller');
const Router = Express.Router();

Router.route('/')
    .post(SearchController.search);

module.exports = Router;