const { Router } = require('express')
const { getMainPage } = require('../controllers/mainpage.controller')
const router = Router()



// /api/mainpage/getdata
router.get('/getdata', getMainPage)





module.exports = router