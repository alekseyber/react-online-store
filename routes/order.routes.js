const { Router } = require('express');
const { sentOrder, getCupon, fetchById, returnProductForm, returnCallForm } = require('../controllers/order.controller');
const router = Router();



// /api/order/sentorder
router.post('/sentorder', sentOrder);

// /api/order/returnproductform
router.post('/returnproductform', returnProductForm);

// /api/order/returncallform
router.post('/returncallform', returnCallForm);

// /api/order/getcupon
router.get('/getcupon', getCupon);

// /api/order/:id
router.get('/:id', fetchById);





module.exports = router