const router = require("express").Router();
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

router.get("/", async (req, res) => {
  const point = req.body;
  try {
    const ubicaciones = await Ubicacion.find();
    const arrayGeo = geoToArray(ubicaciones);
    const lookup = sphereKnn(arrayGeo);
    const resultsQty = 2;

    const points = lookup(point.lat, point.long, resultsQty);
    res.status(200).json(points);
  } catch {
    res.status(500).json(err);
  }
});

module.exports = router;
