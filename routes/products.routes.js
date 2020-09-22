const { Router } = require('express')
const {
  getProductContent,
  //  getBrands,
  //   getBagdes,
  getProductsByIds,
  getProductsHit,
  getProductByAlias,
  //  getRecomacces,
  getProductByLevelToo
} = require('../controllers/products.controller')
const router = Router()





// /api/products/getbrands
//router.get('/getbrands', getBrands)

// /api/products/getbagdes
//router.get('/getbagdes', getBagdes)

// /api/products/getrecomacces
//router.get('/getrecomacces', getRecomacces)

// /api/products/getproductsbyids
router.get('/getproductsbyids', getProductsByIds)

// /api/products/getproductshit
router.get('/getproductshit', getProductsHit)

// /api/products/getproductcontent/:_id
//router.get('/getproductcontent/:_id', getProductContent)

router.get('/getproductcontent/:alias', getProductContent)

// /api/products/getproductbyalias/:alias
router.get('/getproductbyalias/:alias', getProductByAlias)

// /api/products/getproductbylevel/:id
router.get('/getproductbylevel/:id', getProductByLevelToo)

// // /api/products/getproductsimport
// router.get('/getproductsimport', getProductsImport)

module.exports = router