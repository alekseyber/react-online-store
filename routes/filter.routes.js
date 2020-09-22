const { Router } = require('express');
const { getFilter } = require('../controllers/filter.controller');
const router = Router();





//  /api/filter/getfilter
router.get('/getfilter', getFilter);



// // /api/filter/getfilterimport 
// router.get('/getfilterimport', getFilterImport)




module.exports = router