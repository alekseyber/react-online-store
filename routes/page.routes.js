const { Router } = require("express");
const {
  getByAlias,
  getOferta,
  getSizesChart,
} = require("../controllers/page.controller");
const router = Router();

// /api/page/getofertacontent
router.get("/getofertacontent", getOferta);

// /api/page/:alias
router.get("/:alias", getByAlias);

// /api/page/getsizeschart/:id
router.get("/getsizeschart/:id", getSizesChart);

module.exports = router;
