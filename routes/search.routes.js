const { Router } = require('express')
const { searchList, searchFull } = require('../controllers/search.controller')
const router = Router()



// /api/search/list
router.get('/list', searchList)

// /api/search/full
router.get('/full', searchFull)






module.exports = router