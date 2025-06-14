const {
  createLine,
  findCloseLinesToPoint,
  getAll,
} = require("../controllers/lines");

const router = require("express").Router();

router.post("/add", createLine);
router.get("/all", getAll);
router.get("/find-close-to-point", findCloseLinesToPoint);

module.exports = router;
