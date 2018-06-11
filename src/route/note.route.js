const Express = require('express');
const NoteController = require("../controller/note.controller");
const Router = Express.Router();
Router.route('/')
	.post(NoteController.create)
	.put(NoteController.update)
	.delete(NoteController.remove)

module.exports = Router;