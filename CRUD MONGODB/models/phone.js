const mongoose = require("mongoose");
const phone = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
});
module.exports = mongoose.model("phones", phone);
