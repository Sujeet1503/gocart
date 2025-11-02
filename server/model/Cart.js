const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  products: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product" 
  }],
  total: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = { Cart };