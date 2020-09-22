const { Router } = require('express')
const { getSizesChartContent } = require('../controllers/modification.controller')
const router = Router()



// /api/colors/getcolorsgrupp
//router.get('/getcolorsgrupp', getColorsGrupp)

// // /api/modification/getcolors
//router.get('/getcolors', getColors)

// // /api/modification/getsizes
//router.get('/getsizes', getSizes)

// // /api/modification/getsizeschartcontent
router.get('/getsizeschartcontent', getSizesChartContent)






module.exports = router