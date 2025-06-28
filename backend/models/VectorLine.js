const mongoose = require("mongoose");

const VectorLineSchema = new mongoose.Schema({
  lineId: { type: mongoose.Schema.Types.ObjectId, ref: "Line", required: true },
  vectorPoints: [
    {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
  ],
});

VectorLineSchema.index({ "vectorPoints.coordinates": "2dsphere" });

module.exports = mongoose.model("VectorLine", VectorLineSchema, "VectorLines");
