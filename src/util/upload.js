const multer=require('multer');

let UploadUtils={};
UploadUtils.upload=upload;
module.exports=UploadUtils;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+".png")
    }
  });
var upload=multer({ storage: storage }).single("photos");
