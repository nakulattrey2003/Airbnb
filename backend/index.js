const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv").config();
const colors = require("colors");

const app = express();

const authRoutes = require("./routes/authRoute.js");
const listingRoutes = require("./routes/listingRoute.js");
const bookingRoutes = require("./routes/bookingRoute.js");
const userRoutes = require("./routes/userRoute.js");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 5000;

app.use("/auth", authRoutes);
app.use("/properties", listingRoutes);
app.use("/bookings", bookingRoutes);
app.use("/users", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB".green.bold);
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`.brightCyan));
  })
  .catch((error) => console.log(`${error} did not connect`.bold.red));

// wolf - 662daf6656908a8b00d33c2d
// batman - 662e26662e31c2394578b1e2
// Panchkula - 662dc0be56908a8b00d33c7c owned by wolf
// NY - 662e3ed5e1f8939013160a90 owned by batman
