const passport = require('passport')
const { Router } = require('express')
const uploadExcell = require('../middleware/upload-excell')
const { uploadSingle, loadExcell } = require('../controllers/satisexcell.contorller')
const router = Router()

// /api/satisexcell/export/:action
router.get(
    '/export/:action',
    passport.authenticate('jwt', { session: false }),
    loadExcell
)


// /api/satisexcell/import/:action
router.post(
    '/import/:action',
    passport.authenticate('jwt', { session: false }),
    uploadExcell.single('filedata'),
    uploadSingle
)

module.exports = router