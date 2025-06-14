const Line = require("../models/Line");
const Ubicacion = require("../models/Point");

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

    // Create Ubicaciones
    const createdPoints = await Promise.all(
      points.map(async (point) => {
        return await findOrCreateUbicacion(point);
      })
    );
    const pointIds = createdPoints.map((p) => p._id);

    // Create Line
    const addedLine = await Line.create({
      number,
      syndicate,
      points: pointIds,
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

async function findOrCreateUbicacion(point) {
  const { lat, lon } = point;
  let existingPoint = await Ubicacion.findOne({
    lat,
    lon,
  });

  if (!existingPoint) {
    existingPoint = await Ubicacion.create({
      lat,
      lon,
      location: { type: "Point", coordinates: [lon, lat] },
    });
  }

  return existingPoint;
}

async function findCloseLinesToPoint(req, res) {
  try {
    const { lat, lon } = req.body;
    if (typeof lat !== "number" || typeof lon !== "number") {
      return errorResponse(res, 400, "Latitud y longitud deben ser numeros");
    }

    // Check if point exists
    let point = await Ubicacion.findOne({ lat, lon });

    // Query closest Point
    if (!point) {
      point = await Ubicacion.findOne({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lon, lat],
            },
            // $maxDistance: 1000
          },
        },
      });
    }

    // No point found
    if (!point) {
      return errorResponse(res, 400, "No se hallaron puntos cercanos");
    }

    // Point found search Lines
    const lines = await Line.find({ points: point._id });

    return successResponse(res, 200, "Lineas encontradas cercanas al punto", {
      closestPoint: point,
      lines,
    });
  } catch (err) {
    console.error("Error in findCloseLInesToPoint", err);
    return res.status(res, 500, "Error interno del servidor", err.message);
  }
}

module.exports = { createLine, findCloseLinesToPoint, getAll };
