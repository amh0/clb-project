const mongoose = require("mongoose");

const LineSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  syndicate: {
    type: String,
    required: false,
  },

  points: [
    {
      lat: {
        type: Number,
        required: true,
      },
      lon: {
        type: Number,
        required: true,
      },
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: ["Number"], required: true },
    },
  ],
  
  vectorLine: { type: mongoose.Schema.Types.ObjectId, ref: "VectorLine" },
});

LineSchema.index({ "points.coordinates": "2dsphere" });

module.exports = mongoose.model("Line", LineSchema, "Lines");
