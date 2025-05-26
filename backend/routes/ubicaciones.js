const router = require("express").Router();

const { getAll } = require("../controllers/ubicaciones");

router.get("/all", getAll);

module.exports = router;
