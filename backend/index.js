const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");
var cors = require("cors");

dotenv.config();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

app.use("/api/pins", pinRoute);
app.use("/api/auth", userRoute);

app.listen(8800, () => {
  console.log("Server is running on port 8800");
});
