const router = require("express").Router();
const Usuario = require("../models/Usuario");

router.post("/", async (req, res) => {
  const newUsuario = new Usuario(req.body);
  try {
    const savedUsuario = await newUsuario.save();
    res.status(200).json(savedUsuario);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch {
    res.status(500).json(err);
  }
});

module.exports = router;
