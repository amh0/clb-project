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
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

UbicacionSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Ubicacion", UbicacionSchema, "Ubicaciones");
