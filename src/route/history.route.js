const Express = require('express');
const HistoryController = require("../controller/history.controller");
const Router = Express.Router();
Router.route('/')
    .delete(HistoryController.clearHistory)

module.exports = Router;