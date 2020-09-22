const { Router } = require('express')
const { getAll, getByAlias } = require('../controllers/news.controller')
const router = Router()





// /api/news/getall
router.get('/getall', getAll)

// /api/news/:alias
router.get('/:alias', getByAlias)





module.exports = router