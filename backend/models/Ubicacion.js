const mongoose = require("mongoose");

const UbicacionSchema = new mongoose.Schema({
  desc: {
    type: String,
  },
  lat: {
    type: Number,
    require: true,
  },
  long: {
    type: Number,
    require: true,
  },
  lineas: [mongoose.ObjectId],
});

module.exports = mongoose.model("Ubicacion", UbicacionSchema, "Ubicaciones");
