const { Router } = require('express')
const { getMainPageData } = require('../controllers/mainpage.controller')
const router = Router()



// /api/mainpage/getdata
router.get('/getdata', getMainPageData)





module.exports = router