const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema(
  {
    nombreCompleto: {
      type: String,
      require: true,
      max: 40,
    },
    email: {
      type: String,
      require: true,
      max: 50,
    },
    nombreUsuario: {
      type: String,
      require: true,
      max: 40,
      unique: true,
    },
    contrasenia: {
      type: String,
      require: true,
      min: 6,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Usuario", UsuarioSchema, "Usuarios");
