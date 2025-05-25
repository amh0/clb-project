const Ubicacion = require("../models/Ubicacion");
const sphereKnn = require("sphere-knn");

// let lookup    = sphereKnn([
//       /* This array needs to be full of objects that have latitudes and
//        * longitudes. Accepted property names are "lat", "latitude", "lon",
//        * "lng", "long", "longitude". */
//       {lat: ..., lon: ...},

//       /* You can also use an array. */
//       [my_lat, my_lon],

//       ...
//     ])

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
  } catch {
    res.status(500).json(err);
  }
}

module.exports = { findClosestPoints };
