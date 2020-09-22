const passport = require('passport')
const { Router } = require('express')
const { workNoAuth, workAuth } = require('../controllers/cronoswork.contorller')
const router = Router()

// /api/cronoswork/auth/:_id
router.get(
    '/auth/:_id',
    passport.authenticate('jwt', { session: false }),
    workAuth
)

// /api/cronoswork/noauth/:_id
router.get(
    '/noauth/:_id',
    workNoAuth
)

module.exports = router