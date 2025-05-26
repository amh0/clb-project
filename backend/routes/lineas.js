const Linea = require("../models/Linea");
const {
  createLinea,
  findCloseLinesToPoint,
  getAll,
} = require("../controllers/lineas");

const router = require("express").Router();

router.post("/add", createLinea);
router.get("/all", getAll);
router.get("/find-close-to-point", findCloseLinesToPoint);

// Testing
// router.post("/", async (req, res) => {
//   const newLinea = new Linea(req.body);
//   try {
//     const savedLinea = await newLinea.save();
//     res.status(200).json(savedLinea);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// router.get("/", async (req, res) => {
//   try {
//     const lineas = await Linea.find();
//     res.status(200).json(lineas);
//   } catch {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
