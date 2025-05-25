const Linea = require("../models/Linea");
const Ubicacion = require("../models/Ubicacion");

const { successResponse, errorResponse } = require("../utils/response");

async function createLinea(req, res) {
  try {
    const { numero, sindicato, puntos } = req.body;

    if (!numero || !Array.isArray(puntos) || puntos.length === 0) {
      return errorResponse(res, 400, "Numero de Linea y puntos son requeridos");
    }

    // Create Ubicaciones
    const createdPoints = await Promise.all(
      puntos.map(async (point) => {
        return await findOrCreateUbicacion(point);
      })
    );
    const pointIds = createdPoints.map((p) => p._id);

    // Create Linea
    const addedLine = await Linea.create({
      numero,
      sindicato,
      puntos: pointIds,
    });

    return successResponse(res, 201, "Linea creada exitosamente", {
      linea: addedLine,
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
  const { lat, long } = point;
  let existingPoint = await Ubicacion.findOne({
    lat,
    long,
  });

  if (!existingPoint) {
    existingPoint = await Ubicacion.create({
      lat,
      long,
      location: { type: "Point", coordinates: [long, lat] },
    });
  }

  return existingPoint;
}

async function findCloseLinesToPoint(req, res) {
  try {
    const { lat, long } = req.body;
    if (typeof lat !== "number" || typeof long !== "number") {
      return errorResponse(res, 400, "Latitud y longitud deben ser numeros");
    }

    // Check if point exists
    let point = await Ubicacion.findOne({ lat, long });

    // Query closest Point
    if (!point) {
      point = await Ubicacion.findOne({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [long, lat],
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

    // Point found search Lineas
    const lines = await Linea.find({ puntos: point._id });

    return successResponse(res, 200, "Lineas encontradas cercanas al punto", {
      closestPoint: point,
      lines,
    });
  } catch (err) {
    console.error("Error in findCloseLInesToPoint", err);
    return res.status(res, 500, "Error interno del servidor", err.message);
  }
}

module.exports = { createLinea, findCloseLinesToPoint };
