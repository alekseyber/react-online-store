const passport = require('passport')
const { Router } = require('express')
const {
    chekIp,
    orderRegistration,
    deletingOrderByOrder,
    orderDetails,
    creatingOrderReceipt,
    receivingOrderReceipt,
    creatingOrderReceiptByInvoice
} = require('../controllers/satisdelivery.contorller')
const router = Router()

//, deletingOrder

// /api/satisdelivery/chekip
router.get(
    '/chekip',
    passport.authenticate('jwt', { session: false }),
    chekIp
)

// /api/satisdelivery/cdek/orders/:order_id
router.post(
    '/cdek/orders/:order_id',
    passport.authenticate('jwt', { session: false }),
    orderRegistration
)

// /api/satisdelivery/cdek/orders/:order_id
router.put(
    '/cdek/orders/:order_id',
    passport.authenticate('jwt', { session: false }),
    creatingOrderReceiptByInvoice
)

// /api/satisdelivery/cdek/orders/:order_id
router.delete(
    '/cdek/orders/:order_id',
    passport.authenticate('jwt', { session: false }),
    deletingOrderByOrder
)

// /api/satisdelivery/cdek/orders/:order_id
router.get(
    '/cdek/orders/:order_uuid',
    passport.authenticate('jwt', { session: false }),
    orderDetails
)

// /api/satisdelivery/cdek/print
router.post(
    '/cdek/print',
    passport.authenticate('jwt', { session: false }),
    creatingOrderReceipt
)

// /api/satisdelivery/cdek/print/:uuid
router.get(
    '/cdek/print/:uuid',
    passport.authenticate('jwt', { session: false }),
    receivingOrderReceipt
)

module.exports = router