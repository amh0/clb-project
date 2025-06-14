const Line = require("../models/Line");
const pointsController = require("./points");

const { successResponse, errorResponse } = require("../utils/response");

async function getAll(req, res) {
  try {
    const lines = await Line.find();
    return successResponse(res, 200, "Lineas obtenidas", {
      lines,
    });
  } catch (err) {
    console.log("Error en la creación de la Linea.");
    return errorResponse(
      res,
      500,
      "Error en la creación de la Linea",
      err.message
    );
  }
}

async function createLine(req, res) {
  try {
    const { number, syndicate, points } = req.body;

    if (!number || !Array.isArray(points) || points.length === 0) {
      return errorResponse(res, 400, "Numero de Linea y puntos son requeridos");
    }

    // Add points to DB
    await Promise.all(
      points.map(async (point) => {
        return await pointsController.findOrCreatePoint(point);
      })
    );
    // Points to add
    const addedPoints = points.map((point) => ({
      lat: point.lat,
      lon: point.lon,
      type: "Point",
      coordinates: [point.lon, point.lat],
    }));

    // Create Line
    const addedLine = await Line.create({
      number,
      syndicate,
      points: addedPoints,
    });

    return successResponse(res, 201, "Linea creada exitosamente", {
      line: addedLine,
    });
  } catch (err) {
    console.log("Error en la creación de la Linea.");
    return errorResponse(
      res,
      500,
      "Error en la creación de la Linea",
      err.message
    );
  }
}

async function linesNearPoint(req, res) {
  try {
    const { lat, lon } = req.body;
    if (typeof lat !== "number" || typeof lon !== "number") {
      return errorResponse(res, 400, "Latitud y longitud deben ser numeros");
    }

    // Find lines that are within specified radius to the point
    const lines = await Line.find({
      points: {
        $elemMatch: {
          coordinates: {
            $geoWithin: {
              $centerSphere: [[lon, lat], 0.01], // 1km radius
            },
          },
        },
      },
    });

    // No point found
    if (lines.length === 0) {
      return errorResponse(res, 400, "No se hallaron lineas cercanas al punto");
    }

    // Point found search Lines
    return successResponse(res, 200, "Lineas encontradas cercanas al punto", {
      lines,
    });
  } catch (err) {
    console.error("Error in findCloseLInesToPoint", err);
    return res.status(res, 500, "Error interno del servidor", err.message);
  }
}

module.exports = { createLine, linesNearPoint, getAll };
