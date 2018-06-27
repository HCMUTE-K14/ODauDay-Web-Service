const Fs = require('fs');

const LIMIT_IMAGE_UPLOAD = 9;
const MulterHelper = require('../controller/multer-helper');
const Upload = require('../controller/multer-helper').upload.array('images', LIMIT_IMAGE_UPLOAD);


const ImageController = {};
ImageController.upload = upload;
ImageController.get = get;


module.exports = ImageController;

function upload(req, res) {
    Upload(req, res, function(err) {
        if (err) {
            console.log("error: " + err)
            return;
        }
        //console.log(req.files);
        console.log("success");
    });
}

function get(req, res) {
    let name = req.params.name;
    let originPath = MulterHelper.folderPath + "/" + name;
    let path = originPath;
    if (path.indexOf('.') === -1) {
        path = originPath + ".jpg"
    }
    Fs.readFile(path, function(err, content) {
        if (err) {
            Fs.readFile(originPath + ".png", function(err2, content) {
                if (err2) {
                    res.writeHead(400, { 'Content-type': 'text/html' });
                    res.end("No such image");
                } else {
                    res.writeHead(200, { 'Content-type': 'image/jpg' });
                    res.end(content);
                }
            });
        } else {
            res.writeHead(200, { 'Content-type': 'image/jpg' });
            res.end(content);
        }
    });
}