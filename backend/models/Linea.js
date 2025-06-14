const mongoose = require("mongoose");

const LineaSchema = new mongoose.Schema({
  numero: {
    type: Number,
    required: true,
  },
  sindicato: {
    type: String,
    required: false,
  },

  puntos: [
    {
      lat: {
        type: Number,
        required: true,
      },
      long: {
        type: Number,
        required: true,
      },
    },
  ],
});

// Speed up queries of lat long
LineaSchema.index({ "puntos.lat": 1, "puntos.long": 1 });

module.exports = mongoose.model("Linea", LineaSchema, "Lineas");
