const { Router } = require("express");
const { yandexTurboOrderAccept, yandexTurboOrderStatus } = require("../controllers/yandex.controller");
const router = Router();

// /api/yandex/order/accept
router.post("/order/accept", yandexTurboOrderAccept);


// /api/yandex/order/status
router.post("/order/status", yandexTurboOrderStatus);

module.exports = router;
