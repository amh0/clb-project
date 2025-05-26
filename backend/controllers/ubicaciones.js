const Ubicacion = require("../models/Ubicacion");

const { successResponse, errorResponse } = require("../utils/response");
async function getAll(req, res) {
  try {
    const points = await Ubicacion.find();
    return successResponse(res, 200, "Ubicaciones obtenidas", {
      ubicaciones: points,
    });
  } catch (err) {
    return errorResponse(res, 500, "Error interno del servidor", err.message);
  }
}

module.exports = { getAll };
