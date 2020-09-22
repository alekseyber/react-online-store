const passport = require('passport')
const { Router } = require('express')
const { getOrderPdf } = require('../controllers/satispdf.contorller')
const router = Router()

// /api/satispdf/getorder/:order_id
router.get(
    '/getorder/:order_id',
    passport.authenticate('jwt', { session: false }),
    getOrderPdf
)


module.exports = router