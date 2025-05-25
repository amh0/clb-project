const Ubicacion = require("../models/Ubicacion");

function geoToArray(geolocations) {
  const array = [];
  for (const geo of geolocations) {
    array.push([geo.lat, geo.long]);
  }
  return array;
}

async function findClosestPoints(req, res) {
  try {
    const { lat, long } = req.body;
    const resultQty = req.body.resultQty ?? 1;

    const ubicaciones = await Ubicacion.find();
    const arrayGeo = geoToArray(ubicaciones);
    const lookup = sphereKnn(arrayGeo);

    const points = lookup(lat, long, resultQty);
    res.status(200).json(points);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

module.exports = { findClosestPoints };
