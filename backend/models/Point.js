const mongoose = require("mongoose");

const PointSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
  },
  lon: {
    type: Number,
    required: true,
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

PointSchema.index({ lat: 1, lon: 1 }, { unique: true });
PointSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Point", PointSchema, "Points");
