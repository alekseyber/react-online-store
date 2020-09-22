const passport = require('passport')
const { Router } = require('express')
const upload = require('../middleware/upload')
const { uploadSingle, uploadArray } = require('../controllers/satisupload.contorller')
const router = Router()



// /api/satisupload/single
router.post(
    '/single/:modelName',
    passport.authenticate('jwt', { session: false }),
    upload.single('image'),
    uploadSingle
)


// /api/satisupload/array
//upload.array('images'),

router.post(
    '/array/:modelName',
    passport.authenticate('jwt', { session: false }),
    upload.any(),
    uploadArray
)




module.exports = router