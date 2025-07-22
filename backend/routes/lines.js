const {
  createLine,
  getAll,
  linesNearPoint,
  getLineByNumber,
  deleteLineByNumber,
} = require("../controllers/lines");

const router = require("express").Router();

router.post("/add", createLine);
router.get("/all", getAll);
router.get("/near-point", linesNearPoint);
router.get("/get/:number", getLineByNumber);
router.delete("/delete/:number", deleteLineByNumber);

module.exports = router;
