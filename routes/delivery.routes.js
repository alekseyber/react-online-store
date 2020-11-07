const { Router } = require("express");
const { getCity, getPvzList } = require("../controllers/delivery.controller");
const router = Router();

// /api/delivery/getcity
router.get("/getcity", getCity);

// /api/delivery/getdelivery
//router.get('/getdelivery', getDelivery)

// /api/delivery/getpvzlist
router.get("/getpvzlist", getPvzList);

module.exports = router;
