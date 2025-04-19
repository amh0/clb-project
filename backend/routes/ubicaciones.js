const router = require("express").Router();
const Ubicacion = require("../models/Ubicacion");

router.post("/", async (req, res) => {
  const newUbi = new Ubicacion(req.body);
  try {
    const savedUbi = await newUbi.save();
    res.status(200).json(savedUbi);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const ubicaciones = await Ubicacion.find();
    res.status(200).json(ubicaciones);
  } catch {
    res.status(500).json(err);
  }
});

module.exports = router;
