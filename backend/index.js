const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const pointsRoute = require("./routes/points");
const linesRoute = require("./routes/lines");
const geoRoute = require("./routes/geo");

const PORT = 8800;
const app = express();
app.use(express.json());
dotenv.config();

app.use("/api/users", userRoute);
app.use("/api/points", pointsRoute);
app.use("/api/lines", linesRoute);
app.use("/api/geo", geoRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log("Backend server running on: ", PORT);
});
