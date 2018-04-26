const ResponseModel = require('../util/response-model');
const Message = require('../util/message/en');
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');
const multer=require('multer');
const fs=require("fs");

let UploadImages={};
UploadImages.uploadImages=uploadImages;
UploadImages.findImage=findImage;
module.exports =UploadImages;



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+"-"+file.originalname)
    }
  });
var upload=multer({ storage: storage }).array("photos",12);

function uploadImages(req,res){

    upload(req, res, function (err) {
        if (err) {
          console.log("error: "+err)
          return
        }
        console.log("success");
        // Everything went fine
    })
    console.log(upload.array);
    //console.log(req);
}
function findImage(req,res){
    let image_id=req.params.id;
    let folder="uploads/";
    let extention=".png";
    let path=folder+image_id+extention;
    fs.readFile(path, function (err, content) {
        if (err) {
            res.writeHead(400, {'Content-type':'text/html'})
            console.log(err);
            res.end("No such image");    
        } else {
            res.writeHead(200,{'Content-type':'image/jpg'});
            res.end(content);
        }
    });
}


