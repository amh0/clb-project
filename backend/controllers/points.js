const Point = require("../models/Point");

const { successResponse, errorResponse } = require("../utils/response");
async function getAll(req, res) {
  try {
    const points = await Point.find();
    return successResponse(res, 200, "Ubicaciones obtenidas", {
      points,
    });
  } catch (err) {
    return errorResponse(res, 500, "Error interno del servidor", err.message);
  }
}

async function findOrCreatePoint(point) {
  const { lat, lon } = point;
  const resPoint = await Point.findOneAndUpdate(
    { lat, lon },
    {
      $setOnInsert: {
        lat,
        lon,
        location: {
          type: "Point",
          coordinates: [lon, lat],
        },
      },
    },
    { upsert: true, new: true }
  );

  return resPoint;
}

async function findClosestPoint(req, res) {
  try {
    const { lat, lon } = req.body;

    if (typeof lat !== "number" || typeof lon !== "number") {
      return errorResponse(res, 400, "Latitud y longitud deben ser números");
    }

    const closestPoint = await Point.findOne({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lon, lat],
          },
          $maxDistance: 5000, // meters
        },
      },
    });

    if (!closestPoint) {
      return errorResponse(res, 404, "No se encontró un punto cercano");
    }

    return successResponse(res, 200, "Punto más cercano encontrado", {
      point: closestPoint,
    });
  } catch (err) {
    console.error("Error en findClosestPoint", err);
    return errorResponse(res, 500, "Error interno del servidor", err.message);
  }
}
module.exports = { getAll, findOrCreatePoint, findClosestPoint };
