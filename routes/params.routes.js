const { Router } = require('express')
const { getTextReturnProduct } = require('../controllers/params.controller')
const router = Router()



// /api/params/getparams
//router.get('/getparams', getParams)

// /api/params/textreturnproduct
router.get('/textreturnproduct', getTextReturnProduct)






module.exports = router