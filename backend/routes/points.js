const router = require("express").Router();

const { getAll } = require("../controllers/points");

router.get("/all", getAll);

module.exports = router;
