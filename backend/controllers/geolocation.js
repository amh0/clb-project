const Ubicacion = require("../models/Ubicacion");

async function findClosestPoints(req, res) {
  try {
    const { lat, long, resultQty = 1 } = req.body;

    const closestPoints = await Ubicacion.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [long, lat],
          },
        },
      },
    }).limit(resultQty);

    res.status(200).json(closestPoints);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

module.exports = { findClosestPoints };
