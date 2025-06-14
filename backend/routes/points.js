const router = require("express").Router();

const { getAll, findClosestPoint } = require("../controllers/points");

router.get("/all", getAll);
router.get("/closest-point", findClosestPoint);

module.exports = router;
