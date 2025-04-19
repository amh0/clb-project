const mongoose = require("mongoose");

const LineaSchema = new mongoose.Schema({
  numero: {
    type: Number,
    require: true,
  },
  sindicato: {
    type: String,
    require: true,
  },
  trayectoria: [mongoose.ObjectId],
});

module.exports = mongoose.model("Linea", LineaSchema, "Lineas");
