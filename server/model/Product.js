const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  price: Number,
  stock: Number,
  brand: String,
});

const Product = mongoose.model("Product", productSchema);

module.exports = { Product }; // ✅ named export
