//const path = require('path');
const multer = require('multer');
//const moment = require('moment');
//const md5 = require('js-md5');

//const dest = path.resolve(__dirname, '..', 'upload')

// const storage = multer.diskStorage({
//     destination(req, file, cb) {
//         cb(null, path.resolve(__dirname, '..', 'upload'));
//     },
//     filename(req, file, cb) {        
//         const temp = file.originalname.split('.');
//         const ext = temp[temp.length - 1];        
//         const name = md5(moment().format('DDMMYY-HHmmss_SSS') + String(Math.random())) + '.' + ext;
//         cb(null, name);        
//     }
// })
const storage = multer.memoryStorage()
const fileFilter = (_, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/svg+xml') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

module.exports = multer({
    storage, fileFilter, limits: { fileSize: 1024 * 1024 * 7 }
})


//module.exports = multer({ dest })