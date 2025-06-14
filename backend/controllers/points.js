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

module.exports = { getAll };
