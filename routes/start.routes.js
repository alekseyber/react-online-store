const { Router } = require('express')
const { getStart } = require('../controllers/start.controller')
const router = Router()



// /api/start/getstart
router.get('/getstart', getStart)


module.exports = router