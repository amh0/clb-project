const Line = require("../models/Line");
const VectorLine = require("../models/VectorLine");
const pointsController = require("./points");

const { successResponse, errorResponse } = require("../utils/response");
const { transformGeoJSONPoints } = require("../utils/geoPoints");

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
    const { number, syndicate, points, vectorPoints } = req.body;

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

    const response = { line: addedLine };

    // Handle Vector Line creation
    if (Array.isArray(vectorPoints) && vectorPoints.length > 0) {
      const createdVectorLine = await VectorLine.create({
        lineId: addedLine._id,
        vectorPoints: vectorPoints.map((vectorPoint) => ({
          type: "Point",
          coordinates: [vectorPoint.lon, vectorPoint.lat],
        })),
      });

      addedLine.vectorLine = createdVectorLine._id;
      await addedLine.save();

      response.vectorLine = createdVectorLine;
    }

    return successResponse(res, 201, "Linea creada exitosamente", response);
  } catch (err) {
    console.log("Error en la creación de la Linea.");
    console.log(err);
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
    const {
      lat,
      lon,
      includePoints = false,
      includeVectorLine = true,
    } = req.body;

    if (typeof lat !== "number" || typeof lon !== "number") {
      return errorResponse(res, 400, "Latitud y longitud deben ser numeros");
    }

    if (
      typeof includePoints !== "boolean" &&
      typeof includeVectorLine !== "boolean"
    ) {
      return errorResponse(
        res,
        400,
        "includePoints, includeVectorLine deben ser booleanos"
      );
    }
    // Build object to return only selected fields
    const projection = {};
    projection.number = 1;
    projection.syndicate = 1;
    projection.vectorLine = 1;
    if (includePoints) projection.points = 1;

    // Find lines that are inside specified radius to the point
    let query = Line.find({
      points: {
        $elemMatch: {
          coordinates: {
            $geoWithin: {
              $centerSphere: [[lon, lat], 0.01], // 1km radius
            },
          },
        },
      },
    }).select(projection);

    // Conditionally populate vectorLine
    if (includeVectorLine) {
      query = query.populate({
        path: "vectorLine",
        select: "vectorPoints",
      });
    }

    const lines = await query;

    // No point found
    if (lines.length === 0) {
      return errorResponse(res, 400, "No se hallaron lineas cercanas al punto");
    }

    // postprocess: geoJSON points to lat, lon

    const processedLines = lines.map((line) => {
      const obj = line.toObject();

      if (obj.vectorLine && Array.isArray(obj.vectorLine.vectorPoints)) {
        obj.vectorLine.vectorPoints = transformGeoJSONPoints(
          obj.vectorLine.vectorPoints
        );
        console.log(obj);
        console.log(obj.vectorLine);
      }

      return obj;
    });

    return successResponse(res, 200, "Lineas encontradas cercanas al punto", {
      lines: processedLines,
    });
  } catch (err) {
    console.error("Error in findCloseLInesToPoint", err);
    return res.status(res, 500, "Error interno del servidor", err.message);
  }
}

module.exports = { createLine, linesNearPoint, getAll };
