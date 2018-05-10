const multer = require('multer');
const FolderPath = 'uploads';

const MulterHelper = {};

let storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, FolderPath)
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname)
	}
});

let upload = multer({
	storage: storage,
	onFileUploadStart: function(file) {
		console.log('Starting ' + file.originalname);
	},
	onFileUploadData: function(file, data) {
		console.log('Got a chunk of data!');
	},
	onFileUploadComplete: function(file) {
		console.log('Completed file!');
	},
	onParseStart: function() {
		console.log('Starting to parse request!');
	}
});

MulterHelper.upload = upload;
MulterHelper.folderPath = FolderPath;

module.exports = MulterHelper;