const Point = require("../models/Point");
const { successResponse, errorResponse } = require("../utils/response");

async function findClosestPoints(req, res) {
  try {
    const { lat, lon, resultQty = 1 } = req.body;

    const closestPoints = await Point.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lon, lat],
          },
        },
      },
    }).limit(resultQty);

    return successResponse(
      res,
      200,
      "Punto(s) cercano(s) encontrado(s)",
      closestPoints
    );
  } catch (err) {
    return errorResponse(res, 500, "Error interno del servidor", err.message);
  }
}

module.exports = { findClosestPoints };
