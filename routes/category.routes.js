const { Router } = require('express')
const { getProductsForCategory } = require('../controllers/category.controller')
const router = Router()



// /api/category/getcategorytree
//router.get('/getcategorytree', getCategoryTree)

// /api/category/getproductsforcategory/:alias
router.get('/getproductsforcategory/:alias', getProductsForCategory)

// /api/category/getsort
//router.get('/getsort', getSort)

// /api/category/getcategoryimport
//router.get('/getcategoryimport', getCategoryImport)




module.exports = router