const multer = require('multer');

const { storage, fileFilter } = require('./configUpload');

const upload = multer({ storage, fileFilter });

module.exports = upload;