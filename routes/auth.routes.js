const passport = require('passport')
const { Router } = require('express')
const { login, createUser, editPassword, resetPassword } = require('../controllers/auth.contorller')
const router = Router()

// /api/auth/admin/login
router.post('/admin/login', login)

// /api/auth/admin/create
router.post(
    '/admin/create',
    passport.authenticate('jwt', { session: false }),
    createUser
)

// /api/auth/admin/editpassword
router.post(
    '/admin/editpassword',
    passport.authenticate('jwt', { session: false }),
    editPassword
)

// /api/auth/admin/resetpassword
router.post(
    '/admin/resetpassword',    
    resetPassword
)



module.exports = router