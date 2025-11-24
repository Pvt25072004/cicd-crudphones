const express = require("express");
const routes = express.Router();
const Phone = require("../models/phone");

routes.get("/phones", async (req, res) => {
  try {
    // throw new Error("Lỗi test");
    let phones = await Phone.find();
    res.json(phones);
  } catch (err) {
    res.status(500).json({ err: "Server error" });
  }
});
routes.post("/phone", async (req, res) => {
  try {
    const newPhone = new Phone({
      name: req.body.name,
      price: req.body.price,
    });

    const saved = await newPhone.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ err: "Server error" });
  }
});
routes.delete("/delete/:id", async (req, res) => {
  try {
    await Phone.findByIdAndDelete(req.params.id);
    res.status(201).send("Successful delete");
  } catch (err) {
    console.log(err);
  }
});
routes.put("/update/:id", async (req, res) => {
  try {
    let idPhone = req.params.id;
    await Phone.findByIdAndUpdate(
      idPhone,
      { name: req.body.name, price: req.body.price },
      { new: true }
    );
    res.status(201).send("Successful update");
  } catch (err) {
    console.log(err);
  }
});

module.exports = routes;
