const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const usuarioRoute = require("./routes/usuarios");
const ubicacionesRoute = require("./routes/ubicaciones");
const lineasRoute = require("./routes/lineas");

const PORT = 8800;
const app = express();
app.use(express.json());
dotenv.config();

app.use("/api/usuarios", usuarioRoute);
app.use("/api/ubicaciones", ubicacionesRoute);
app.use("/api/lineas", lineasRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log("Backend server is running...");
});
