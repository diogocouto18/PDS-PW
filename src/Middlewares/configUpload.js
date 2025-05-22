const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Criação da pasta de uploads
const uploadDir = path.join(__dirname, '..', 'Uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'dados_comprovacao') {
        return cb(null, true);
    }
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        return cb(null, true);
    }
    cb(null, false);
};

// Exportar os dois
module.exports = { storage, fileFilter };