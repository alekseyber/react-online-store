const { Router } = require('express')
const { getByAlias, getOferta } = require('../controllers/page.controller')
const router = Router()




// /api/page/getofertacontent
router.get('/getofertacontent', getOferta)

// /api/page/:alias
router.get('/:alias', getByAlias)





module.exports = router