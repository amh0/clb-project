const mongoose = require("mongoose");

const LineaSchema = new mongoose.Schema({
  numero: {
    type: Number,
    require: true,
  },
  sindicato: {
    type: String,
    require: false,
  },

  puntos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ubicacion" }],
});

module.exports = mongoose.model("Linea", LineaSchema, "Lineas");
