const router = require("express").Router();
const { findClosestPoints } = require("../controllers/geolocation");

router.get("/get-close-points", findClosestPoints);

module.exports = router;
