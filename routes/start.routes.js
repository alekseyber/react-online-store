const { Router } = require("express");
const {
  getStart,
  getTextReturn,
  getStartTest,
} = require("../controllers/start.controller");
const router = Router();

// /api/start/getstart
router.get("/getstart", getStart);

// /api/start/textreturnproduct
router.get("/textreturnproduct", getTextReturn);

// /api/start/getstarttest
router.get("/getstarttest", getStartTest);

module.exports = router;
