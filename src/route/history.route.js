const Express = require('express');
const HistoryController = require("../controller/history.controller");
const Router = Express.Router();

Router.route('/')
	.post(HistoryController.create)
    .delete(HistoryController.clearHistory);

Router.route('/details')
	.get(HistoryController.getDetails);

module.exports = Router;