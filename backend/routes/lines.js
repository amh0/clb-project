const { createLine, getAll, linesNearPoint } = require("../controllers/lines");

const router = require("express").Router();

router.post("/add", createLine);
router.get("/all", getAll);
router.get("/near-point", linesNearPoint);

module.exports = router;
