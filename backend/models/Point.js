const mongoose = require("mongoose");

const PointsSchema = new mongoose.Schema({
  desc: {
    type: String,
  },
  lat: {
    type: Number,
    require: true,
  },
  lon: {
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

module.exports = mongoose.model("Point", PointsSchema, "Points");
