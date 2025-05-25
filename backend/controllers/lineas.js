const Linea = require("../models/Linea");
const Ubicacion = require("../models/Ubicacion");

async function createLinea(req, res) {
  try {
    const { numero, sindicato, puntos } = req.body;

    if (!numero || !Array.isArray(puntos) || puntos.length === 0) {
      return res
        .status(400)
        .json({ error: "Numero de linea y puntos son requeridos." });
    }

    // Create Ubicaciones
    const createdPoints = await Ubicacion.insertMany(puntos);
    const pointIds = createdPoints.map((p) => p._id);

    // Create Linea
    const addedLine = await Linea.create({
      numero,
      sindicato,
      point_ids: pointIds,
    });

    res
      .status(200)
      .json({ message: "Linea creada exitosamente", linea: addedLine });
  } catch (err) {
    console.log("Error en la creación de la Linea.");
    res.status(500).json(err);
  }
}

module.exports = { createLinea };
