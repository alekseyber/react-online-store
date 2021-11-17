const { Router } = require("express");
const { yandexTurboOrder } = require("../controllers/yandex.controller");
const router = Router();

// /api/yandex/order/accept
router.post("/order/accept", yandexTurboOrder);

module.exports = router;
