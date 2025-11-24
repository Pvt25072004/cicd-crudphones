const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const apiRouter = require("./routers/apiUser");

const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1/crud_products";

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("DB connected to " + DB_URL);
  })
  .catch((err) => {
    console.log(err);
  });
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRouter);
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
