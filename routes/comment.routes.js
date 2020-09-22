const { Router } = require('express')
const { getAll, addComment } = require('../controllers/comment.controller')
const router = Router()





// /api/comment/getall
router.get('/getall', getAll)

// /api/comment/addcomment
router.post('/addcomment', addComment);





module.exports = router