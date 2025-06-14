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
    },
  ],
});

// Speed up queries of lat lon
LineSchema.index({ "puntos.lat": 1, "puntos.lon": 1 });

module.exports = mongoose.model("Line", LineSchema, "Lines");
