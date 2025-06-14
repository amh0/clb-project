const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
      max: 40,
    },
    email: {
      type: String,
      require: true,
      max: 50,
    },
    userName: {
      type: String,
      require: true,
      max: 40,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 6,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema, "Users");
