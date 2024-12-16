const multer = require('multer');
const {extname,join} = require('path');
const {existsSync,mkdirSync} = require("fs");

let filesPath = join(__dirname,'..','..','public','logos','sub-admins');
const allowedTypes = ["image/jpeg", "image/png"];


if(!existsSync(filesPath)){
    mkdirSync(filesPath,{recursive:true});
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, filesPath)
    },
    filename: function (req, file, cb) {
      const filename = file.fieldname + '-' + Date.now()+extname(file.originalname);
      cb(null, filename);
    }
});

// file filter
const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept file
    } else {
      cb(new Error("Invalid file type. Only JPEG and PNG are allowed!"), false); // Reject file
    }
  };

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // file size to 5MB
});

module.exports = upload;