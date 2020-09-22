//const path = require('path');
const multer = require('multer');

const storage = multer.memoryStorage()
const fileFilter = (req, file, cb) => {
    
    if (file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

module.exports = multer({
    storage, fileFilter, limits: { fileSize: 1024 * 1024 * 15 }
})


//module.exports = multer({ dest })